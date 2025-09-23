import React from 'react';

const TOC = ({ title = 'Contents', items = [] }) => {
  return (
    <nav className="terms-toc">
      <span className="toc-title">{title}</span>
      <ul>
        {items.map((it) => (
          <li key={it.href}>
            <a href={it.href}>{it.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default TOC;
