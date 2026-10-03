import { Show, createSignal, onMount } from 'solid-js';
import { Heart, History, Image, Printer, RotateCcw } from 'lucide-solid';
import { navCopy } from '../copy/ui';
import { getHistory } from '../logic/history';
import { navigate } from '../router';

function LogoMark() {
  return (
    <span class="logo-mark" aria-hidden="true">
      <Heart size={18} fill="currentColor" />
    </span>
  );
}

export function NavLogo() {
  return (
    <a
      class="nav-logo"
      href="#/"
      aria-label={navCopy.logoAria}
      onClick={(e) => {
        e.preventDefault();
        void navigate('/');
      }}
    >
      <LogoMark />
      <span class="logo-text">FWTI</span>
    </a>
  );
}

export function TopNav(props: { meta?: string }) {
  const [hasHistory, setHasHistory] = createSignal(false);
  onMount(() => {
    setHasHistory(getHistory().length > 0);
  });

  return (
    <nav class="top-nav">
      <div class="nav-inner">
        <NavLogo />
        <div class="nav-right">
          <Show when={props.meta}>
            <div class="nav-meta">{props.meta}</div>
          </Show>
          <Show when={hasHistory()}>
            <button
              class="nav-history"
              type="button"
              onClick={() => void navigate('/history')}
              aria-label={navCopy.historyAria}
            >
              <History class="nav-action-icon" aria-hidden="true" />
              <span>{navCopy.historyLabel}</span>
            </button>
          </Show>
        </div>
      </div>
    </nav>
  );
}

export function ResultNav(props: {
  onRestart: () => void;
  onShareImage: () => void;
  onPrint: () => void;
}) {
  return (
    <nav class="top-nav">
      <div class="nav-inner">
        <NavLogo />
        <div class="nav-right">
          <button
            class="nav-restart"
            type="button"
            onClick={props.onShareImage}
            aria-label={navCopy.resultNav.shareImage}
          >
            <Image class="nav-action-icon" aria-hidden="true" />
            <span>{navCopy.resultNav.shareImage}</span>
          </button>
          <button
            class="nav-restart nav-print"
            type="button"
            onClick={props.onPrint}
            aria-label={navCopy.resultNav.print}
          >
            <Printer class="nav-action-icon" aria-hidden="true" />
            <span>{navCopy.resultNav.print}</span>
          </button>
          <button
            class="nav-restart"
            type="button"
            onClick={props.onRestart}
            aria-label={navCopy.resultNav.restart}
          >
            <RotateCcw class="nav-action-icon" aria-hidden="true" />
            <span>{navCopy.resultNav.restart}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
