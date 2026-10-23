import React, { useState, useRef, useEffect } from 'react';
import './liquid-glass.css';

export interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface LiquidGlassNavBarProps {
  trackTitle?: string;
  trackArtist?: string;
  trackArtworkUrl?: string;
  isPlaying?: boolean;
  onPlayPause?: () => Unit;
  onNext?: () => Unit;
  onSearch?: () => Unit;
  tabs?: Tab[];
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
}

type Unit = void;

const DEFAULT_TABS: Tab[] = [
  {
    id: 'home',
    label: 'Trang chủ',
    icon: (
      <svg className="liquid-tab-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    id: 'explore',
    label: 'Khám phá',
    icon: (
      <svg className="liquid-tab-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z" />
      </svg>
    ),
  },
  {
    id: 'library',
    label: 'Thư viện',
    icon: (
      <svg className="liquid-tab-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z" />
      </svg>
    ),
  },
];

export const LiquidGlassNavBar: React.FC<LiquidGlassNavBarProps> = ({
  trackTitle = 'SAO BĂNG',
  trackArtist = 'Khiem',
  trackArtworkUrl = 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=150',
  isPlaying = false,
  onPlayPause,
  onNext,
  onSearch,
  tabs = DEFAULT_TABS,
  activeTabId,
  onTabChange,
}) => {
  const [currentTab, setCurrentTab] = useState(activeTabId || tabs[0].id);
  const [playing, setPlaying] = useState(isPlaying);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 6, width: 0 });
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // Update physical indicator position based on active DOM tab button
  useEffect(() => {
    if (!tabsContainerRef.current) return;
    const activeBtn = tabsContainerRef.current.querySelector<HTMLButtonElement>(`[data-tab-id="${currentTab}"]`);
    if (activeBtn) {
      const containerLeft = tabsContainerRef.current.getBoundingClientRect().left;
      const btnRect = activeBtn.getBoundingClientRect();
      setIndicatorStyle({
        left: btnRect.left - containerLeft,
        width: btnRect.width,
      });
    }
  }, [currentTab, tabs]);

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId);
    onTabChange?.(tabId);
  };

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPlaying(!playing);
    onPlayPause?.();
  };

  return (
    <div className="liquid-dock-container">
      {/* 1. Mini Player Bar */}
      <div className="liquid-glass-surface liquid-mini-player">
        <div className="liquid-album-art">
          <img src={trackArtworkUrl} alt="Album artwork" />
        </div>
        <div className="liquid-track-details">
          <div className="liquid-track-title">{trackTitle}</div>
          <div className="liquid-track-artist">{trackArtist}</div>
        </div>
        <div className="liquid-player-controls">
          <button className="liquid-ctrl-btn" onClick={handlePlayToggle} aria-label={playing ? 'Pause' : 'Play'}>
            {playing ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
          <button className="liquid-ctrl-btn" onClick={onNext} aria-label="Next track">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* 2. Navigation Row */}
      <div className="liquid-nav-row">
        <nav className="liquid-glass-surface liquid-nav-tabs" ref={tabsContainerRef}>
          {/* Animated Liquid Indicator */}
          <div
            className="liquid-selection-indicator"
            style={{
              left: `${indicatorStyle.left}px`,
              width: `${indicatorStyle.width}px`,
            }}
          />

          {tabs.map((tab) => (
            <button
              key={tab.id}
              data-tab-id={tab.id}
              className={`liquid-tab-button ${currentTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Standalone Circular Search Pill */}
        <button
          className="liquid-glass-surface liquid-search-button"
          onClick={onSearch}
          aria-label="Search"
        >
          <svg className="liquid-search-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 14z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default LiquidGlassNavBar;
