# 📸 Images manquantes et bugs d'interface — Stockholm Kafé V3

## 🎯 Comment récupérer les designs Figma

**Méthode utilisée :**
1. Utiliser le serveur MCP Figma (`user-figma`)
2. Appeler `get_figma_data` avec :
   - `fileKey`: extrait de l'URL (ex: `SHX1fC3r7KGSly9LeqtXLj`)
   - `nodeId`: extrait de l'URL (ex: `1:2` pour node-id=1-2)
3. Les données Figma sont sauvegardées dans `agent-tools/` avec tous les détails (couleurs, typographie, images, layout)

---

## 📋 LISTE DES IMAGES MANQUANTES

### Emplacement : `frontend/public/images/`

#### **Header (node 1-151)**
1. ✅ **`logo.png`** — Logo Kafé Stockholm (200.85x182.92px)
   - Référence Figma: `imageRef: 966034f8c6f4ac34eef1ebf38d3bbb7912f20d69`
   - Utilisé dans: Header (gauche)

#### **Hero 1 (section hero-1)**
2. ❌ **`hero-stockholm.jpg`** — Image de fond Stockholm (1967x1475px)
   - Référence Figma: `imageRef: aaac173d4848b8f8216679509ba61b809c80c405`
   - Utilisé dans: Hero 1 background (image de Stockholm avec neige)
   - **Alternative dans Figma:** `imageRef: 4bead878d2091519bbcf086576684a0a89043a46` (drapeau Suède)

#### **Hero 2 (section hero-2)**
3. ❌ **`hero-brunch.jpg`** — Image de fond brunch (1854x1160px)
   - Référence Figma: `imageRef: 6ff4ef15691666b3dc1b4d8e823ebf4d27ed5493`
   - Utilisé dans: Hero 2 background (image brunch/product)
4. ❌ **`hero-product.jpg`** — Image produit superposée (1004x1220px)
   - Référence Figma: `imageRef: 1202c9aeff41756866b546ff723c3d2ecb41acd6`
   - Utilisé dans: Hero 2 (image produit superposée à droite)

#### **Section Privatisation**
5. ❌ **`privatisation-1.jpg`** — Photo espace privatisation (640x779px)
   - Référence Figma: `imageRef: 72a0738f215477f67365645b9571c672cfcb0c0c`
   - Utilisé dans: Section privatisation, première image
6. ❌ **`privatisation-2.jpg`** — Photo espace privatisation (562x734px)
   - Référence Figma: `imageRef: 31bcf6c485c6f826666cb6f6bbd8a4b616ce1dd2`
   - Utilisé dans: Section privatisation, deuxième image
7. ❌ **`privatisation-3.jpg`** — Photo espace privatisation (613x443px)
   - Référence Figma: `imageRef: b2fb2834c0a6140128fef72cbc266b3991ef35b3`
   - Utilisé dans: Section privatisation, troisième image

#### **Section Equipe**
8. ❌ **`equipe-1.jpg`** — Photo équipe (437x329px)
   - Référence Figma: `imageRef: 5cc7b18ff3420bd1800d1554da9c9ce71d69d648`
   - Utilisé dans: Section équipe, première photo
9. ❌ **`equipe-2.jpg`** — Photo équipe (696x390px)
   - Référence Figma: `imageRef: 2aa21349b6aec413514e24195e45d2aed753fa31`
   - Utilisé dans: Section équipe, deuxième photo

#### **Section Prince**
10. ❌ **`prince-visit.jpg`** — Photo visite Prince (1462x825px)
    - Référence Figma: `imageRef: aeb20a2673bc737f2daa2245424836909811df0a`
    - Utilisé dans: Section "Visite Prince" background
11. ❌ **`prince-image.jpg`** — Image Prince (752x829px)
    - Référence Figma: `imageRef: 26c3cfb36fd176686342e3e24b05b4d5231ff1d9`
    - Utilisé dans: Section "Visite Prince" (image à gauche)

#### **Section "Pourquoi le Stockholm?"**
12. ❌ **`pourquoi-stockholm-bg.jpg`** — Image de fond drapeaux (218x145px)
    - Référence Figma: `imageRef: 447bf5923b31af8a01cf08d3f6add2ca10e30961`
    - Utilisé dans: Section "Pourquoi le Stockholm?" (petite image drapeaux en haut à droite)

#### **Produits (cartes produits)**
13. ❌ **`produit-kanelbulle.jpg`** — Image Kanelbulle (392x295px)
    - Référence Figma: `imageRef: f73b3f6c89ed88486d7aabf07483a5e9279714f3`
    - Utilisé dans: Carte produit Kanelbulle
14. ❌ **`produit-smorgas.jpg`** — Image Smörgås (392x295px)
    - Référence Figma: `imageRef: 98bd1168def259b8d240c59150b73fb560ed59b1`
    - Utilisé dans: Carte produit Smörgås
15. ❌ **`produit-kaffe.jpg`** — Image Kaffe (392x295px)
    - Référence Figma: `imageRef: 907c1410a984b7084ee616f4ba2e8f3fe5af929a`
    - Utilisé dans: Carte produit Kaffe

---

## 🐛 BUGS D'INTERFACE IDENTIFIÉS

### **1. Responsive Design — Tailles de police trop grandes**
- **Problème:** Les tailles de police sont en pixels fixes (ex: `text-[304px]`, `text-[144px]`)
- **Impact:** Sur mobile/tablette, les textes seront énormes et illisibles
- **Solution:** Utiliser `clamp()` ou classes Tailwind responsive
- **Fichiers concernés:**
  - `frontend/pages/index.tsx` (Hero 1, Hero 2, sections)

### **2. Header — Hauteur fixe trop grande sur mobile**
- **Problème:** Header avec `h-[183px]` sur tous les écrans
- **Impact:** Prend trop de place sur mobile
- **Solution:** Réduire à `h-20 lg:h-[183px]` ou similaire
- **Fichier:** `frontend/components/ecommerce/EcommerceHeaderFigma.tsx` ligne 65

### **3. Hero sections — Min-height trop grand sur mobile**
- **Problème:** `min-h-screen` et `min-h-[1220px]` prennent toute la hauteur
- **Impact:** Sections trop hautes sur mobile
- **Solution:** Utiliser `min-h-[100vh] lg:min-h-screen` avec breakpoints
- **Fichier:** `frontend/pages/index.tsx` lignes 77, 111

### **4. Boutons Hero 2 — Tailles fixes trop grandes**
- **Problème:** Boutons avec `h-[168px]` et `text-[45px]` fixes
- **Impact:** Boutons énormes sur mobile
- **Solution:** Utiliser des tailles responsive
- **Fichier:** `frontend/pages/index.tsx` lignes 149, 155

### **5. Section "Pourquoi le Stockholm?" — Tailles de texte fixes**
- **Problème:** `text-[57px]`, `text-[33px]` fixes
- **Impact:** Textes trop grands sur petits écrans
- **Solution:** Utiliser `clamp()` ou classes Tailwind responsive
- **Fichier:** `frontend/pages/index.tsx` lignes 179, 182

### **6. Section Privatisation — Tailles fixes**
- **Problème:** `text-[67px]`, `text-[26px]`, `h-[127px]` fixes
- **Impact:** Section mal dimensionnée sur mobile
- **Solution:** Ajouter des breakpoints responsive
- **Fichier:** `frontend/pages/index.tsx` lignes 252, 256, 261

### **7. Section Equipe — Tailles fixes**
- **Problème:** `text-[68px]` fixe
- **Impact:** Titre trop grand sur mobile
- **Solution:** Utiliser des tailles responsive
- **Fichier:** `frontend/pages/index.tsx` ligne 288

### **8. Section Prince — Tailles fixes**
- **Problème:** `text-[88px]`, `text-[53px]` fixes
- **Impact:** Textes énormes sur mobile
- **Solution:** Utiliser `clamp()` ou responsive
- **Fichier:** `frontend/pages/index.tsx` lignes 317, 320

### **9. Section Horaires — Tailles fixes**
- **Problème:** `text-[61px]`, `text-[26px]`, `text-[22px]` fixes
- **Impact:** Textes trop grands sur mobile
- **Solution:** Ajouter des breakpoints
- **Fichier:** `frontend/pages/index.tsx` lignes 336, 348, 349

### **10. Navigation Header — Espacement trop grand sur mobile**
- **Problème:** `gap-[43px]` entre liens de navigation
- **Impact:** Navigation trop espacée sur petits écrans
- **Solution:** Réduire l'espacement sur mobile
- **Fichier:** `frontend/components/ecommerce/EcommerceHeaderFigma.tsx` ligne 83

### **11. Images manquantes — Fallback non optimal**
- **Problème:** Les images utilisent des URLs Unsplash en fallback
- **Impact:** Images génériques au lieu des vraies images du café
- **Solution:** Ajouter les vraies images dans `/public/images/`
- **Fichiers:** Tous les fichiers avec `<img src="/images/...">`

### **12. Background page — Image manquante**
- **Problème:** Background de la page d'accueil (fill_FYL15L) non implémenté
- **Référence Figma:** `imageRef: aeb20a2673bc737f2daa2245424836909811df0a`
- **Solution:** Ajouter `background-page.jpg` et l'appliquer au body ou container principal

---

## ✅ RÉSUMÉ — NOMS EXACTS DES IMAGES À AJOUTER

Placez ces images dans **`frontend/public/images/`** :

1. `logo.png` (200x183px recommandé)
2. `hero-stockholm.jpg` (1967x1475px ou équivalent)
3. `hero-brunch.jpg` (1854x1160px ou équivalent)
4. `hero-product.jpg` (1004x1220px ou équivalent) — optionnel, pour Hero 2
5. `privatisation-1.jpg` (640x779px)
6. `privatisation-2.jpg` (562x734px)
7. `privatisation-3.jpg` (613x443px)
8. `equipe-1.jpg` (437x329px)
9. `equipe-2.jpg` (696x390px)
10. `prince-visit.jpg` (1462x825px)
11. `prince-image.jpg` (752x829px)
12. `pourquoi-stockholm-bg.jpg` (218x145px) — optionnel, petit drapeau
13. `background-page.jpg` (pour le fond de page général)

**Note:** Les images de produits (kanelbulle, smörgås, kaffe) sont gérées dynamiquement via l'API produits, mais vous pouvez ajouter des images par défaut si nécessaire.

---

## 🔧 AMÉLIORATIONS RECOMMANDÉES

1. **Ajouter des breakpoints responsive** pour toutes les tailles fixes
2. **Utiliser `next/image`** au lieu de `<img>` pour l'optimisation
3. **Ajouter des `alt` descriptifs** pour l'accessibilité
4. **Implémenter le lazy loading** pour les images hors viewport
5. **Créer un composant ImageWrapper** réutilisable avec fallback
