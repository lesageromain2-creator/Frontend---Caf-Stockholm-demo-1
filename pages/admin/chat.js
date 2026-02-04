// frontend/pages/admin/chat.js - Page admin de gestion des conversations
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import { 
  MessageSquare, 
  Search, 
  Send, 
  ArrowLeft,
  Loader2,
  CheckCheck,
  Clock,
  User as UserIcon,
  XCircle,
  Filter,
  RefreshCw
} from 'lucide-react';
import { 
  checkAuth, 
  getAdminUsers,
  getAdminHotelUsers,
  getAdminChatConversations,
  createAdminChatConversation,
  getChatMessages,
  sendChatMessage,
  markChatAsRead,
  closeChatConversation,
  getChatStats
} from '../../utils/api';
import { toast } from 'react-toastify';

export default function AdminChat() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [selectingClient, setSelectingClient] = useState(false);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const pollingRef = useRef(null);

  useEffect(() => {
    loadData();
    
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      pollingRef.current = setInterval(() => {
        loadMessages(selectedConversation.id, true);
      }, 5000);
      
      return () => {
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
        }
      };
    }
  }, [selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadData = async () => {
    try {
      setLoading(true);
      const authData = await checkAuth();
      if (!authData.authenticated || (authData.user?.role !== 'admin' && authData.user?.role !== 'staff')) {
        router.push('/login?redirect=/admin/chat');
        return;
      }
      setUser(authData.user);

      const [clientsData, hotelUsersData, statsData] = await Promise.all([
        getAdminUsers().catch(() => ({ users: [] })),
        getAdminHotelUsers({ limit: 500 }).catch(() => ({ users: [] })),
        loadStats().catch(() => ({ stats: null }))
      ]);
      const fromDashboard = clientsData.users || clientsData || [];
      const fromHotel = (hotelUsersData.users || []).filter((u) => u.role === 'client');
      const merged = fromDashboard.length > 0 ? fromDashboard : fromHotel;
      setClients(merged);
      if (statsData?.stats) setStats(statsData.stats);
    } catch (error) {
      console.error('Erreur chargement:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const loadConversations = async () => {
    try {
      const data = await getAdminChatConversations(filters);
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Erreur chargement conversations:', error);
    }
  };

  const filteredClients = searchQuery.trim()
    ? clients.filter(c => {
        const q = searchQuery.toLowerCase();
        return (c.firstname || '').toLowerCase().includes(q) ||
          (c.lastname || '').toLowerCase().includes(q) ||
          (c.email || '').toLowerCase().includes(q) ||
          (c.company_name || '').toLowerCase().includes(q);
      })
    : clients;

  const getOrSelectConversationForClient = async (client) => {
    const existing = conversations.find(c => c.user_id === client.id && c.status !== 'closed');
    if (existing) {
      setSelectedConversation(existing);
      await loadMessages(existing.id);
      return;
    }
    try {
      setSelectingClient(true);
      const res = await createAdminChatConversation(client.id);
      const conv = res.conversation;
      if (conv) {
        setConversations(prev => [conv, ...prev]);
        setSelectedConversation(conv);
        await loadMessages(conv.id);
      }
    } catch (err) {
      console.error('Erreur ouverture conversation:', err);
      toast.error('Impossible d\'ouvrir la conversation');
    } finally {
      setSelectingClient(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await getChatStats();
      setStats(data.stats);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  const loadMessages = async (conversationId, silent = false) => {
    try {
      if (!silent) setLoadingMessages(true);
      const data = await getChatMessages(conversationId);
      setMessages(data.messages || []);
      
      await markChatAsRead(conversationId);
      
      setConversations(prev => prev.map(c => 
        c.id === conversationId ? { ...c, unread_admin: 0 } : c
      ));
    } catch (error) {
      console.error('Erreur chargement messages:', error);
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  };

  const selectConversation = async (conv) => {
    setSelectedConversation(conv);
    await loadMessages(conv.id);
  };

  const getInitials = (firstname, lastname) => {
    return `${(firstname || '').charAt(0)}${(lastname || '').charAt(0)}`.toUpperCase();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !selectedConversation) return;

    try {
      setSending(true);
      const result = await sendChatMessage(selectedConversation.id, newMessage);
      
      setMessages(prev => [...prev, result.message]);
      setNewMessage('');
      
      setConversations(prev => prev.map(c => 
        c.id === selectedConversation.id 
          ? { ...c, last_message: newMessage, last_message_at: new Date().toISOString() }
          : c
      ).sort((a, b) => new Date(b.last_message_at) - new Date(a.last_message_at)));
      
    } catch (error) {
      console.error('Erreur envoi message:', error);
      toast.error('Erreur lors de l\'envoi');
    } finally {
      setSending(false);
    }
  };

  const handleCloseConversation = async () => {
    if (!selectedConversation) return;
    
    if (!confirm('Voulez-vous fermer cette conversation ?')) return;
    
    try {
      await closeChatConversation(selectedConversation.id);
      
      setConversations(prev => prev.map(c => 
        c.id === selectedConversation.id ? { ...c, status: 'closed' } : c
      ));
      
      setSelectedConversation(prev => ({ ...prev, status: 'closed' }));
      
      toast.success('Conversation fermée');
    } catch (error) {
      console.error('Erreur fermeture:', error);
      toast.error('Erreur lors de la fermeture');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return `Hier ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    }
  };

  if (loading) {
    return (
      <div className="admin-layout">
        <AdminSidebar activeSection="chat" />
        <div className="admin-main">
          <div className="loading-container">
            <Loader2 className="animate-spin" size={48} />
            <p>Chargement...</p>
          </div>
        </div>
        <style jsx>{`
          .admin-layout { display: flex; min-height: 100vh; background: #0a0a0f; }
          .admin-main { flex: 1; margin-left: 260px; }
          .loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 50vh; color: #9ca3af; }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Chat - Admin LE SAGE DEV</title>
      </Head>

      <div className="admin-layout">
        <AdminSidebar activeSection="chat" />
        <div className="admin-main">
          <AdminHeader user={user} />
          
          <main className="admin-content">
            {/* Stats */}
            {stats && (
              <div className="stats-row">
                <div className="stat-card">
                  <span className="stat-value">{stats.active_conversations || 0}</span>
                  <span className="stat-label">Actives</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{stats.total_unread || 0}</span>
                  <span className="stat-label">Non lus</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{stats.messages_today || 0}</span>
                  <span className="stat-label">Aujourd'hui</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">{stats.new_this_week || 0}</span>
                  <span className="stat-label">Cette semaine</span>
                </div>
              </div>
            )}

            {/* Menu déroulant : sélectionner un client (comme page Clients) */}
            <div className="user-select-row">
              <label htmlFor="admin-chat-user-select" className="user-select-label">
                <UserIcon size={18} />
                Sélectionner un client
              </label>
              <select
                id="admin-chat-user-select"
                className="user-select-dropdown"
                value={selectedConversation?.user_id ?? ''}
                onChange={(e) => {
                  const userId = e.target.value || null;
                  if (userId) {
                    const client = clients.find((c) => c.id === userId);
                    if (client) getOrSelectConversationForClient(client);
                  } else {
                    setSelectedConversation(null);
                  }
                }}
                disabled={selectingClient}
              >
                <option value="">— Choisir un client pour voir ou démarrer le chat —</option>
                {filteredClients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.firstname} {client.lastname} — {client.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="chat-container">
              {/* Liste des clients (comme page Clients) */}
              <aside className={`conversations-sidebar ${selectedConversation ? 'hide-mobile' : ''}`}>
                <div className="sidebar-header">
                  <h2>Clients</h2>
                  <button className="btn-refresh" onClick={loadData} title="Rafraîchir">
                    <RefreshCw size={18} />
                  </button>
                </div>

                <div className="filters">
                  <div className="search-box">
                    <Search size={18} />
                    <input
                      type="text"
                      placeholder="Rechercher un client..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                <div className="conversations-list">
                  {filteredClients.length === 0 ? (
                    <div className="empty">
                      <UserIcon size={32} />
                      <p>{clients.length === 0 ? 'Aucun client' : 'Aucun client trouvé'}</p>
                    </div>
                  ) : (
                    filteredClients.map((client) => {
                      const conv = conversations.find(c => c.user_id === client.id);
                      const isSelected = selectedConversation?.user_id === client.id;
                      return (
                        <div 
                          key={client.id}
                          className={`conversation-item ${isSelected ? 'active' : ''} ${conv?.status === 'closed' ? 'closed' : ''}`}
                          onClick={() => getOrSelectConversationForClient(client)}
                        >
                          <div className="conversation-avatar">
                            {client.avatar_url ? (
                              <img src={client.avatar_url} alt="" />
                            ) : (
                              <span>{getInitials(client.firstname, client.lastname)}</span>
                            )}
                          </div>
                          <div className="conversation-info">
                            <div className="conversation-header">
                              <span className="conversation-name">
                                {client.firstname} {client.lastname}
                              </span>
                              {conv?.last_message_at && (
                                <span className="conversation-time">
                                  {formatDate(conv.last_message_at)}
                                </span>
                              )}
                            </div>
                            <p className="conversation-email">{client.email}</p>
                            {conv && (
                              <>
                                <p className="conversation-subject">{conv.subject}</p>
                                {conv.last_message && (
                                  <p className="conversation-preview">{conv.last_message}</p>
                                )}
                              </>
                            )}
                          </div>
                          {conv?.unread_admin > 0 && (
                            <span className="unread-badge">{conv.unread_admin}</span>
                          )}
                          {conv?.status === 'closed' && (
                            <span className="status-badge closed">Fermée</span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </aside>

              {/* Zone de chat */}
              <section className={`chat-area ${!selectedConversation ? 'hide-mobile' : ''}`}>
                {selectedConversation ? (
                  <>
                    <div className="chat-header">
                      <button 
                        className="btn-back-mobile"
                        onClick={() => setSelectedConversation(null)}
                      >
                        <ArrowLeft size={20} />
                      </button>
                      <div className="chat-header-info">
                        <h3>{selectedConversation.user_firstname} {selectedConversation.user_lastname}</h3>
                        <span className="chat-email">{selectedConversation.user_email}</span>
                        <span className="chat-subject">{selectedConversation.subject}</span>
                      </div>
                      <div className="chat-actions">
                        {selectedConversation.status === 'active' && (
                          <button 
                            className="btn-close-conv"
                            onClick={handleCloseConversation}
                            title="Fermer la conversation"
                          >
                            <XCircle size={20} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="messages-container">
                      {loadingMessages ? (
                        <div className="messages-loading">
                          <Loader2 className="animate-spin" size={24} />
                        </div>
                      ) : (
                        <>
                          {messages.map((msg, index) => {
                            const isAdmin = msg.sender_role === 'admin' || msg.sender_role === 'staff';
                            const showAvatar = index === 0 || messages[index - 1]?.sender_id !== msg.sender_id;
                            
                            return (
                              <div 
                                key={msg.id} 
                                className={`message ${isAdmin ? 'own' : 'other'}`}
                              >
                                {!isAdmin && showAvatar && (
                                  <div className="message-avatar">
                                    {msg.sender_firstname?.[0]}{msg.sender_lastname?.[0]}
                                  </div>
                                )}
                                <div className="message-content">
                                  {showAvatar && (
                                    <span className="message-sender">
                                      {msg.sender_firstname} {msg.sender_lastname}
                                      {isAdmin && <span className="admin-badge">Admin</span>}
                                    </span>
                                  )}
                                  <div className="message-bubble">
                                    <p>{msg.message}</p>
                                  </div>
                                  <div className="message-meta">
                                    <span className="message-time">
                                      {formatDate(msg.created_at)}
                                    </span>
                                    {isAdmin && (
                                      <span className="message-status">
                                        {msg.is_read ? (
                                          <CheckCheck size={14} className="read" />
                                        ) : (
                                          <Clock size={14} />
                                        )}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          <div ref={messagesEndRef} />
                        </>
                      )}
                    </div>

                    {selectedConversation.status === 'active' ? (
                      <form className="message-input" onSubmit={handleSendMessage}>
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Répondre au client..."
                          disabled={sending}
                        />
                        <button type="submit" disabled={!newMessage.trim() || sending}>
                          {sending ? (
                            <Loader2 className="animate-spin" size={20} />
                          ) : (
                            <Send size={20} />
                          )}
                        </button>
                      </form>
                    ) : (
                      <div className="conversation-closed">
                        <XCircle size={20} />
                        <span>Cette conversation est fermée</span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="no-conversation">
                    <MessageSquare size={64} />
                    <h3>Sélectionnez un client</h3>
                    <p>Choisissez un client dans la liste ou via le menu déroulant ci-dessus pour démarrer ou poursuivre une conversation.</p>
                  </div>
                )}
              </section>
            </div>
          </main>
        </div>
      </div>

      <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #0f172a;
        }

        .admin-main {
          flex: 1;
          margin-left: 260px;
          padding-top: 80px;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          overflow: hidden;
        }

        .admin-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
          padding: 1.5rem 2rem 2rem;
          max-width: 1600px;
          margin: 0 auto;
          width: 100%;
        }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
          margin-bottom: 1.75rem;
          flex-shrink: 0;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.04);
          border-radius: 14px;
          padding: 1.25rem 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.02em;
        }

        .stat-label {
          font-size: 0.8125rem;
          color: rgba(255, 255, 255, 0.5);
          margin-top: 0.25rem;
        }

        .user-select-row {
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .user-select-label {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
        }

        .user-select-dropdown {
          max-width: 420px;
          padding: 0.625rem 0.875rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          color: #fff;
          font-size: 0.875rem;
          cursor: pointer;
        }

        .user-select-dropdown:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .user-select-dropdown option {
          background: #1e293b;
          color: #fff;
        }

        .chat-container {
          display: grid;
          grid-template-columns: 320px 1fr;
          gap: 1.5rem;
          flex: 1;
          min-height: 0;
          min-height: 420px;
        }

        .conversations-sidebar {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          flex-shrink: 0;
        }

        .sidebar-header h2 {
          font-size: 1rem;
          font-weight: 600;
          color: #fff;
          letter-spacing: -0.01em;
        }

        .btn-refresh {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .btn-refresh:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.08);
        }

        .filters {
          display: flex;
          gap: 0.75rem;
          padding: 0.75rem 1.25rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          flex-shrink: 0;
        }

        .search-box {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          color: rgba(255, 255, 255, 0.5);
          border: 1px solid transparent;
        }

        .search-box:focus-within {
          border-color: rgba(59, 130, 246, 0.4);
          background: rgba(255, 255, 255, 0.06);
        }

        .search-box input {
          flex: 1;
          background: none;
          border: none;
          color: #fff;
          font-size: 0.8125rem;
          min-width: 0;
        }

        .search-box input::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }

        .search-box input:focus {
          outline: none;
        }

        .conversations-list {
          flex: 1;
          overflow-y: auto;
          padding: 0.5rem;
          min-height: 0;
        }

        .conversations-list::-webkit-scrollbar {
          width: 6px;
        }

        .conversations-list::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 3px;
        }

        .empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 1.5rem;
          color: rgba(255, 255, 255, 0.45);
          text-align: center;
        }

        .empty p {
          margin-top: 0.75rem;
          font-size: 0.875rem;
        }

        .conversation-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          cursor: pointer;
          border-radius: 10px;
          margin-bottom: 0.25rem;
          transition: background 0.2s;
          position: relative;
        }

        .conversation-item:hover {
          background: rgba(255, 255, 255, 0.06);
        }

        .conversation-item.active {
          background: rgba(59, 130, 246, 0.12);
          border: 1px solid rgba(59, 130, 246, 0.25);
        }

        .conversation-item.closed {
          opacity: 0.65;
        }

        .conversation-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }

        .conversation-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .conversation-avatar span {
          color: #fff;
          font-weight: 600;
          font-size: 0.75rem;
        }

        .conversation-info {
          flex: 1;
          min-width: 0;
          padding-right: 1.5rem;
        }

        .conversation-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.125rem;
        }

        .conversation-name {
          font-weight: 600;
          color: #fff;
          font-size: 0.875rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .conversation-time {
          font-size: 0.6875rem;
          color: rgba(255, 255, 255, 0.4);
          flex-shrink: 0;
        }

        .conversation-email {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.45);
          margin-bottom: 0.125rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .conversation-subject {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          margin-bottom: 0.125rem;
        }

        .conversation-preview {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.35);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .unread-badge {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: #ef4444;
          color: #fff;
          font-size: 0.625rem;
          font-weight: 600;
          padding: 0.2rem 0.45rem;
          border-radius: 8px;
          min-width: 18px;
          text-align: center;
        }

        .status-badge {
          position: absolute;
          right: 0.75rem;
          bottom: 0.75rem;
          font-size: 0.625rem;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
        }

        .status-badge.closed {
          background: rgba(255, 255, 255, 0.1);
          color: rgba(255, 255, 255, 0.5);
        }

        .chat-area {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-height: 0;
        }

        .chat-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          flex-shrink: 0;
        }

        .btn-back-mobile {
          display: none;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.6);
          cursor: pointer;
        }

        .chat-header-info {
          flex: 1;
          min-width: 0;
        }

        .chat-header-info h3 {
          font-size: 0.9375rem;
          font-weight: 600;
          color: #fff;
          margin-bottom: 0.25rem;
        }

        .chat-email {
          display: block;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .chat-subject {
          display: block;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          margin-top: 0.125rem;
        }

        .chat-actions {
          display: flex;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .btn-close-conv {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .btn-close-conv:hover {
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          min-height: 0;
        }

        .messages-container::-webkit-scrollbar {
          width: 8px;
        }

        .messages-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.12);
          border-radius: 4px;
        }

        .messages-loading {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.45);
          min-height: 120px;
        }

        .message {
          display: flex;
          gap: 0.625rem;
          max-width: 75%;
        }

        .message.own {
          margin-left: auto;
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #93c5fd;
          font-size: 0.625rem;
          font-weight: 600;
          flex-shrink: 0;
        }

        .message-content {
          display: flex;
          flex-direction: column;
        }

        .message.own .message-content {
          align-items: flex-end;
        }

        .message-sender {
          font-size: 0.6875rem;
          color: rgba(255, 255, 255, 0.45);
          margin-bottom: 0.2rem;
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }

        .admin-badge {
          background: rgba(59, 130, 246, 0.4);
          color: #e0e7ff;
          font-size: 0.5625rem;
          padding: 0.125rem 0.35rem;
          border-radius: 4px;
        }

        .message-bubble {
          padding: 0.625rem 0.875rem;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .message.own .message-bubble {
          background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
          border: none;
        }

        .message-bubble p {
          color: rgba(255, 255, 255, 0.95);
          line-height: 1.5;
          font-size: 0.875rem;
          margin: 0;
          word-break: break-word;
        }

        .message-meta {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          margin-top: 0.2rem;
        }

        .message-time {
          font-size: 0.625rem;
          color: rgba(255, 255, 255, 0.4);
        }

        .message-status .read {
          color: #67e8f9;
        }

        .message-input {
          display: flex;
          gap: 0.75rem;
          padding: 1rem 1.25rem;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          flex-shrink: 0;
        }

        .message-input input {
          flex: 1;
          padding: 0.625rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          color: #fff;
          font-size: 0.875rem;
          min-width: 0;
        }

        .message-input input::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }

        .message-input input:focus {
          outline: none;
          border-color: rgba(59, 130, 246, 0.5);
        }

        .message-input button {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
          border: none;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .message-input button:hover:not(:disabled) {
          opacity: 0.95;
        }

        .message-input button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .conversation-closed {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.8125rem;
          flex-shrink: 0;
        }

        .no-conversation {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.45);
          text-align: center;
          padding: 2rem;
          min-height: 280px;
        }

        .no-conversation h3 {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.125rem;
          margin: 1rem 0 0.5rem;
        }

        .no-conversation p {
          font-size: 0.875rem;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .admin-main {
            margin-left: 0;
          }

          .admin-content {
            padding: 1rem 1.25rem;
          }

          .stats-row {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            margin-bottom: 1.25rem;
          }

          .user-select-row {
            margin-bottom: 1.25rem;
          }

          .chat-container {
            grid-template-columns: 1fr;
            min-height: 450px;
          }

          .conversations-sidebar.hide-mobile,
          .chat-area.hide-mobile {
            display: none;
          }

          .btn-back-mobile {
            display: flex;
          }
        }
      `}</style>
    </>
  );
}
