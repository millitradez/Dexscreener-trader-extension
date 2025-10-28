# React Migration Guide

This extension is currently built with vanilla JavaScript and can be loaded directly into Chrome without any build step. However, we've prepared the groundwork for a React + Vite migration when you're ready.

## Current Setup (Vanilla JS)

The extension currently works without any build process:
- Load directly from the project folder in Chrome
- All files are plain HTML/CSS/JS
- TailwindCSS loaded via CDN

## Migrating to React + Vite

When you're ready to migrate to React, follow these steps:

### 1. Install Dependencies

```bash
npm install
```

This will install:
- React & React DOM
- Vite (build tool)
- Tailwind CSS (as PostCSS plugin instead of CDN)
- TypeScript types for Chrome extensions

### 2. Project Structure

After migration, your project will look like:

```
├── dist/                  # Built extension (load this in Chrome)
├── src/
│   ├── popup/
│   │   ├── App.tsx       # Main React popup component
│   │   ├── index.tsx     # React entry point
│   │   └── index.html    # Popup HTML
│   ├── background/
│   │   └── index.ts      # Background service worker
│   ├── content/
│   │   └── index.ts      # Content script
│   └── utils/
│       └── api.ts        # Shared utilities
├── public/
│   ├── manifest.json     # Extension manifest
│   └── icons/            # Extension icons
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
└── tsconfig.json         # TypeScript configuration
```

### 3. Build Commands

```bash
# Development (with hot reload)
npm run dev

# Production build
npm run build:react

# Preview production build
npm run preview
```

### 4. Loading the Built Extension

1. Run `npm run build:react`
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `dist` folder

### 5. Benefits of React Migration

- **Component Reusability**: Break down UI into reusable components
- **Type Safety**: Use TypeScript for better development experience
- **Better State Management**: Use React hooks and context
- **Hot Module Replacement**: Faster development with instant updates
- **Optimized Builds**: Smaller bundle sizes with Vite
- **Modern Tooling**: Access to the React ecosystem

### 6. Gradual Migration Strategy

You don't have to migrate everything at once:

1. **Phase 1**: Convert popup to React (keep background and content scripts in vanilla JS)
2. **Phase 2**: Convert content script to React (for complex UI injections)
3. **Phase 3**: Add TypeScript for better type safety
4. **Phase 4**: Add advanced features (state management, testing, etc.)

### 7. Example React Popup Component

A starter React popup component is available in `react-examples/Popup.tsx` showing:
- Token input handling with React state
- API integration with hooks
- TailwindCSS styling
- Error handling and loading states

## Notes

- The vanilla JS version will continue to work
- Both versions can coexist during migration
- The build setup is already configured and ready to use
- Vite config is optimized for Chrome extension development

## Need Help?

Check out:
- [Vite Chrome Extension Guide](https://vitejs.dev/guide/)
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/mv3/)
- [React Documentation](https://react.dev/)
