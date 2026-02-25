/**
 * Page d'information « Démo » — Explique aux clients que l'interface est une démo
 * et qu'elle sera entièrement personnalisable selon leurs besoins.
 */

import Head from 'next/head';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { Info, Palette, Layout, Sparkles, ArrowLeft } from 'lucide-react';

export default function DemoInfoPage() {
  return (
    <AdminLayout>
      <Head>
        <title>Page de démo — Interface personnalisable</title>
        <meta
          name="description"
          content="Cette interface est une démonstration. Elle sera entièrement personnalisable pour vos clients."
        />
      </Head>

      <div className="min-h-screen bg-white">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <Link
              href="/admin/ecommerce/dashboard"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour au dashboard
            </Link>
            <h1 className="font-heading text-2xl text-gray-900 flex items-center gap-2">
              <Info className="w-8 h-8 text-kafe-primary" />
              Page de démonstration
            </h1>
            <p className="text-gray-600 mt-1">
              Vous avez cliqué sur une section de l’interface d’administration en mode démo.
            </p>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
          <section className="bg-gray-50 rounded-lg border border-gray-200 p-8">
            <h2 className="font-heading text-xl text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-kafe-primary" />
              Une démo pour vous projeter
            </h2>
            <p className="text-gray-700 leading-relaxed">
              L’espace d’administration que vous parcourez est une <strong className="text-gray-900">page de démonstration</strong>.
              Elle présente la structure et les fonctionnalités possibles d’un back-office pour votre activité.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Les sections telles que <strong className="text-gray-900">Rendez-vous</strong>, <strong className="text-gray-900">Support</strong>,{' '}
              <strong className="text-gray-900">Marketing</strong>, <strong className="text-gray-900">Avis</strong>,{' '}
              <strong className="text-gray-900">Contenu</strong> et <strong className="text-gray-900">Paramètres</strong> sont
              ici des exemples. Elles pourront être adaptées, renommées ou complétées en fonction de vos besoins réels.
            </p>
          </section>

          <section className="bg-gray-50 rounded-lg border border-gray-200 p-8">
            <h2 className="font-heading text-xl text-gray-900 mb-4 flex items-center gap-2">
              <Palette className="w-6 h-6 text-kafe-primary" />
              Entièrement personnalisable
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Pour chaque client, l’interface sera <strong className="text-gray-900">entièrement personnalisable</strong> :
            </p>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-kafe-primary mt-1">•</span>
                <span>Choix des modules affichés (rendez-vous, support, marketing, avis, contenu, paramètres, etc.)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-kafe-primary mt-1">•</span>
                <span>Adaptation des libellés et du vocabulaire à votre métier</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-kafe-primary mt-1">•</span>
                <span>Personnalisation du design (couleurs, logo, mise en page)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-kafe-primary mt-1">•</span>
                <span>Activation ou désactivation de fonctionnalités selon votre cahier des charges</span>
              </li>
            </ul>
          </section>

          <section className="bg-gray-50 rounded-lg border border-gray-200 p-8">
            <h2 className="font-heading text-xl text-gray-900 mb-4 flex items-center gap-2">
              <Layout className="w-6 h-6 text-kafe-primary" />
              Un projet sur mesure
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Cette démo a pour but de vous donner une idée concrète de ce que peut devenir votre outil.
              Chaque projet est conçu <strong className="text-gray-900">sur mesure</strong> en fonction de vos processus,
              de votre équipe et de vos objectifs.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Pour en discuter et définir ensemble la version qui vous correspond, n’hésitez pas à nous contacter.
            </p>
          </section>

          <div className="flex justify-center pt-4">
            <Link
              href="/admin/ecommerce/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-kafe-primary text-white rounded-refined font-medium hover:bg-kafe-primary-dark transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Retour au dashboard
            </Link>
          </div>
        </main>
      </div>
    </AdminLayout>
  );
}
