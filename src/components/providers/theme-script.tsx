export function ThemeScript() {
  const script = `(function(){try{var t=localStorage.getItem('theme')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var e=document.documentElement;e.classList.toggle('dark',d);e.dataset.theme=t;}catch(e){}})();`;
  return (
    <script
      // Runs before paint to avoid a flash of the wrong theme.
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
