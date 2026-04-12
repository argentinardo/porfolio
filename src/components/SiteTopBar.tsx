import './SiteTopBar.css';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bars3Icon, Cog6ToothIcon, MoonIcon, SunIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useTheme } from '../context/ThemeContext';

export interface TopBarSection {
  id: string;
}

interface SiteTopBarProps {
  sections: TopBarSection[];
  activeSection: number;
  onSectionClick: (index: number) => void;
}

const mapBrowserLanguage = (browserLang: string): string => {
  const languageMap: Record<string, string> = {
    es: 'es',
    en: 'en',
    ca: 'ca',
    'es-ES': 'es',
    'en-US': 'en',
    'en-GB': 'en',
    'ca-ES': 'ca',
  };
  return languageMap[browserLang] || 'es';
};

const LANG_CONFIG = [
  { code: 'es' as const, labelKey: 'topbar.langEs' },
  { code: 'ca' as const, labelKey: 'topbar.langCa' },
  { code: 'en' as const, labelKey: 'topbar.langEn' },
];

const SiteTopBar: React.FC<SiteTopBarProps> = ({
  sections,
  activeSection,
  onSectionClick,
}) => {
  const { t, i18n } = useTranslation();
  const { isDark, setDark } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onLang = () => setCurrentLanguage(i18n.language);
    i18n.on('languageChanged', onLang);
    if (!localStorage.getItem('i18nextLng')) {
      i18n.changeLanguage(mapBrowserLanguage(navigator.language));
    }
    return () => {
      i18n.off('languageChanged', onLang);
    };
  }, [i18n]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!settingsOpen) return;
    const onDocDown = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSettingsOpen(false);
    };
    document.addEventListener('mousedown', onDocDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [settingsOpen]);

  const changeLanguage = useCallback(
    (lng: string) => {
      i18n.changeLanguage(lng);
      setCurrentLanguage(lng);
      setSettingsOpen(false);
    },
    [i18n]
  );

  const handleNav = useCallback(
    (index: number) => {
      onSectionClick(index);
      setMobileOpen(false);
    },
    [onSectionClick]
  );

  const navKey = (id: string) => `navigation.${id}` as const;

  const toggleMobileMenu = useCallback(() => {
    setSettingsOpen(false);
    setMobileOpen((o) => !o);
  }, []);

  const toggleSettings = useCallback(() => {
    setMobileOpen(false);
    setSettingsOpen((o) => !o);
  }, []);

  return (
    <header
      className={`site-topbar ${isDark ? 'site-topbar--dark' : 'site-topbar--light'}`}
      role="banner"
    >
      <div className="site-topbar__inner">
        <button
          type="button"
          className="site-topbar__menu-btn md:hidden"
          onClick={toggleMobileMenu}
          aria-expanded={mobileOpen}
          aria-controls="site-topbar-mobile-panel"
          aria-label={mobileOpen ? t('topbar.closeMenu') : t('topbar.openMenu')}
        >
          {mobileOpen ? (
            <XMarkIcon className="site-topbar__icon" />
          ) : (
            <Bars3Icon className="site-topbar__icon" />
          )}
        </button>

        <span className="site-topbar__brand font-label">
          {t('topbar.brand')}
        </span>

        <nav
          className="site-topbar__nav site-topbar__nav--desktop"
          aria-label={t('topbar.sectionsNav')}
        >
          {sections.map((section, index) => (
            <button
              key={section.id}
              type="button"
              className={`site-topbar__link ${index === activeSection ? 'is-active' : ''}`}
              onClick={() => handleNav(index)}
              aria-current={index === activeSection ? 'true' : undefined}
            >
              {t(navKey(section.id))}
            </button>
          ))}
        </nav>

        <div className="site-topbar__actions">
          <div className="site-topbar__settings" ref={settingsRef}>
            <button
              type="button"
              className="site-topbar__settings-trigger"
              onClick={toggleSettings}
              aria-expanded={settingsOpen}
              aria-haspopup="true"
              aria-controls="site-topbar-settings-panel"
              aria-label={settingsOpen ? t('topbar.closeSettings') : t('topbar.openSettings')}
            >
              <Cog6ToothIcon className="site-topbar__icon" aria-hidden />
            </button>

            <div
              id="site-topbar-settings-panel"
              className={`site-topbar__settings-panel ${settingsOpen ? 'is-open' : ''}`}
              role="region"
              aria-label={t('topbar.settings')}
              aria-hidden={!settingsOpen}
            >
              <div className="site-topbar__settings-section">
              <p
                className="site-topbar__settings-heading flex items-center justify-between w-full"
                id="site-topbar-theme-heading"
              >
                <span>Settings</span>
                <button
              type="button"
              className="site-topbar__settings-trigger"
              onClick={toggleSettings}
              aria-expanded={settingsOpen}
              aria-haspopup="true"
              aria-controls="site-topbar-settings-panel"
              aria-label={settingsOpen ? t('topbar.closeSettings') : t('topbar.openSettings')}
            >
              <Cog6ToothIcon className="site-topbar__icon" aria-hidden />
            </button>
              </p>
           

              </div>
              <div className="site-topbar__settings-section">
                <p className="site-topbar__settings-heading" id="site-topbar-theme-heading">
                  {t('topbar.themeSection')}
                </p>
                <div
                  className="site-topbar__segmented"
                  role="radiogroup"
                  aria-labelledby="site-topbar-theme-heading"
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={isDark}
                    className={`site-topbar__segment-btn ${isDark ? 'is-active' : ''}`}
                    onClick={() => setDark(true)}
                  >
                    <MoonIcon className="site-topbar__segment-icon" aria-hidden />
                    <span>{t('topbar.themeModeDark')}</span>
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={!isDark}
                    className={`site-topbar__segment-btn ${!isDark ? 'is-active' : ''}`}
                    onClick={() => setDark(false)}
                  >
                    <SunIcon className="site-topbar__segment-icon" aria-hidden />
                    <span>{t('topbar.themeModeLight')}</span>
                  </button>
                </div>
              </div>

              <div className="site-topbar__settings-section">
                <p className="site-topbar__settings-heading" id="site-topbar-lang-heading">
                  {t('topbar.language')}
                </p>
                <div
                  className="site-topbar__lang-list"
                  role="radiogroup"
                  aria-labelledby="site-topbar-lang-heading"
                >
                  {LANG_CONFIG.map(({ code, labelKey }) => {
                    const active = currentLanguage.startsWith(code);
                    return (
                      <button
                        key={code}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        className={`site-topbar__lang-option ${active ? 'is-active' : ''}`}
                        onClick={() => changeLanguage(code)}
                      >
                        <span className="site-topbar__lang-code">{code.toUpperCase()}</span>
                        <span>{t(labelKey)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        id="site-topbar-mobile-panel"
        className={`site-topbar__mobile-panel md:hidden ${mobileOpen ? 'is-open' : ''}`}
        hidden={!mobileOpen}
      >
        <nav className="site-topbar__mobile-nav" aria-label={t('topbar.sectionsNav')}>
          {sections.map((section, index) => (
            <button
              key={section.id}
              type="button"
              className={`site-topbar__mobile-link ${index === activeSection ? 'is-active' : ''}`}
              onClick={() => handleNav(index)}
            >
              {t(navKey(section.id))}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default SiteTopBar;
