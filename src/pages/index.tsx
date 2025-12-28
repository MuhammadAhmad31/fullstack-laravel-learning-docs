import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          🚀 Laravel Fullstack Developer — Learning Guide
        </Heading>
        <p className="hero__subtitle">Disusun untuk Pemula hingga Menengah</p>
        <div className="mb-4">
          <p className="text-sm">
            <strong>Penulis:</strong> Muhammad | <strong>Versi:</strong> 1.0 | <strong>Platform:</strong> Docusaurus
          </p>
        </div>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Mulai Belajar Laravel - 5min ⏱️
          </Link>
        </div>
      </div>
    </header>
  );
}

function WelcomeSection() {
  return (
    <section className="container margin-top--lg margin-bottom--lg">
      <div className="row">
        <div className="col col--8 col--offset-2">
          <Heading as="h2">Selamat Datang! 👋</Heading>
          <p className="margin-bottom--md">
            Panduan ini dibuat untuk membantu kamu belajar Laravel sebagai Fullstack Developer, 
            mulai dari dasar hingga konsep lanjutan.
          </p>
          
          <Heading as="h3" className="margin-top--lg">Panduan ini cocok untuk:</Heading>
          <ul>
            <li>✨ Pemula yang baru mulai dengan Laravel</li>
            <li>💻 Backend developer yang ingin memperdalam Laravel</li>
            <li>🚀 Fullstack developer yang menggunakan Laravel + Blade</li>
            <li>🎓 Mahasiswa yang mengerjakan project atau skripsi</li>
            <li>📚 Developer yang ingin memahami best practice Laravel</li>
          </ul>

          <Heading as="h3" className="margin-top--lg">📘 Tentang Modul Ini</Heading>
          <p>
            Modul ini disusun sebagai materi pembelajaran terstruktur untuk peserta yang ingin 
            menguasai Laravel sebagai Fullstack Developer.
          </p>
          <p>
            Fokus utama modul ini adalah memberikan pembelajaran bertahap, mendalam, dan aplikatif, 
            dilengkapi dengan konsep dasar hingga advanced yang relevan untuk kebutuhan industri.
          </p>

          <Heading as="h3" className="margin-top--lg">🔗 Sumber Pembelajaran</Heading>
          <p>Materi dalam dokumentasi ini disusun berdasarkan referensi resmi:</p>
          <ul>
            <li>
              <a href="https://laravel.com/docs" target="_blank" rel="noopener noreferrer">
                Laravel Official Documentation
              </a>
            </li>
            <li>Artikel dan best practice dari berbagai engineer & komunitas</li>
            <li>Pengalaman praktis penulis dalam mengerjakan project real-world</li>
          </ul>

          <Heading as="h3" className="margin-top--lg">👨‍💻 Tentang Penulis</Heading>
          <div className="card margin-top--md">
            <div className="card__header">
              <h3>MUHAMMAD</h3>
            </div>
            <div className="card__body">
              <p>
                Fullstack Web Developer dengan fokus pada pengembangan website dan mobile apps 
                menggunakan Express JS, React JS, Vue JS, Typescript, Laravel, dan Flutter.
              </p>
              <p className="margin-top--md">
                <strong>Contact for Collaboration:</strong>
              </p>
              <ul>
                <li>
                  <strong>GitHub:</strong>{' '}
                  <a href="https://github.com/MuhammadAhmad31" target="_blank" rel="noopener noreferrer">
                    github.com/MuhammadAhmad31
                  </a>
                </li>
                <li>
                  <strong>LinkedIn:</strong>{' '}
                  <a href="https://www.linkedin.com/in/muhammad-3a4a78215/" target="_blank" rel="noopener noreferrer">
                    linkedin.com/in/muhammad-3a4a78215
                  </a>
                </li>
                <li>
                  <strong>Email:</strong>{' '}
                  <a href="mailto:muhammadtok2001@gmail.com">
                    muhammadtok2001@gmail.com
                  </a>
                </li>
              </ul>
              <p className="margin-top--md">
                Penulis aktif membagikan materi pembelajaran seputar web development dan software engineering.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Panduan lengkap Laravel Fullstack Developer untuk pemula hingga menengah">
      <HomepageHeader />
      <main>
        <WelcomeSection />
      </main>
    </Layout>
  );
}