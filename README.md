# Vinit Dhatrak - Portfolio Website

A minimalistic, modern, and geeky portfolio website built with vanilla HTML, CSS, and JavaScript. Optimized for performance and deployed on Cloudflare Pages.

## 🚀 Features

- **Minimalistic Design**: Clean, modern interface with a focus on content
- **Geeky Elements**: Terminal-inspired components, code snippets, and developer-friendly aesthetics
- **Fully Responsive**: Works perfectly on all devices and screen sizes
- **Dark/Light Theme**: Toggle between themes with system preference detection
- **Smooth Animations**: Subtle animations and transitions for enhanced UX
- **Accessible**: WCAG compliant with proper semantic markup and keyboard navigation
- **Fast Loading**: Optimized for performance with minimal dependencies
- **SEO Friendly**: Proper meta tags and semantic HTML structure

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: CSS Grid, Flexbox, CSS Custom Properties
- **Fonts**: Inter (UI), JetBrains Mono (Code)
- **Deployment**: Cloudflare Pages
- **Domain**: dhatrak.com

## 🎨 Design Philosophy

The design follows a minimalistic approach with:
- Clean typography and generous whitespace
- Terminal-inspired elements for a geeky feel
- Subtle animations that don't distract from content
- Consistent color scheme with accent colors
- Mobile-first responsive design

## 📱 Responsive Design

The website is fully responsive with breakpoints at:
- Mobile: < 480px
- Tablet: 481px - 768px
- Desktop: > 768px

## 🚀 Getting Started

### Prerequisites
- Python 3 (for local development server)
- Node.js and npm (optional, for development tools)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/vinitdhatrak/portfolio.git
   cd portfolio
   ```

2. **Start local server**
   ```bash
   # Using Python
   python -m http.server 3000
   
   # Or using Node.js (if package.json is available)
   npm run dev
   ```

3. **Open in browser**
   Navigate to `http://localhost:3000`

### Development Tools (Optional)

Install development dependencies:
```bash
npm install
```

Available scripts:
```bash
npm run lint:html    # Lint HTML files
npm run lint:css     # Lint CSS files
npm run lint:js      # Lint JavaScript files
npm run format       # Format all files with Prettier
npm run preview      # Preview with Wrangler
```

## 🌐 Deployment

### Cloudflare Pages

The site is configured for automatic deployment on Cloudflare Pages:

1. **Connect your repository** to Cloudflare Pages
2. **Set build settings**:
   - Build command: (leave empty for static site)
   - Build output directory: `/`
   - Root directory: `/`

3. **Custom domain**: Configure `dhatrak.com` in Cloudflare Pages settings

### Manual Deployment

Using Wrangler CLI:
```bash
npm run deploy
```

## 📁 Project Structure

```
portfolio/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── script.js           # JavaScript functionality
├── package.json        # Project configuration
├── wrangler.toml       # Cloudflare configuration
├── _redirects          # Redirect rules
├── README.md           # Documentation
└── Profile.pdf         # Resume/CV
```

## ✨ Features Breakdown

### Interactive Elements
- **Typing Animation**: Dynamic text in hero section
- **Terminal Window**: Animated terminal with command output
- **Smooth Scrolling**: Smooth navigation between sections
- **Theme Toggle**: Switch between dark and light modes
- **Mobile Menu**: Responsive navigation menu

### Animations
- **Scroll Animations**: Elements animate in as they come into view
- **Hover Effects**: Subtle hover states on interactive elements
- **Loading Animations**: Smooth page load transitions
- **Typing Cursor**: Blinking cursor animation

### Accessibility
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and semantic markup
- **High Contrast Support**: Respects user's contrast preferences
- **Reduced Motion**: Respects user's motion preferences

## 🎯 Performance Optimizations

- **Minimal Dependencies**: No external frameworks
- **Optimized Images**: Efficient image loading
- **CSS Custom Properties**: Efficient theming
- **Throttled Events**: Optimized scroll event handlers
- **Lazy Loading**: Content loads as needed

## 🔧 Customization

### Colors
Update CSS custom properties in `:root` selector in `styles.css`:
```css
:root {
  --accent-primary: #00ff88;    /* Primary accent color */
  --accent-secondary: #0066ff;  /* Secondary accent color */
  /* ... other colors */
}
```

### Content
Update content directly in `index.html`:
- Personal information in hero section
- Experience details in timeline
- Project information in cards
- Contact information in footer

### Animations
Modify animation parameters in `script.js`:
```javascript
const config = {
  typingSpeed: 100,        // Typing animation speed
  typingDelay: 1000,       // Delay between text changes
  // ... other configurations
};
```

## 📧 Contact

- **Email**: vinit.dhatrak@gmail.com
- **LinkedIn**: [linkedin.com/in/vinit-dhatrak](https://linkedin.com/in/vinit-dhatrak)
- **Website**: [dhatrak.com](https://dhatrak.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Fonts**: Google Fonts (Inter, JetBrains Mono)
- **Icons**: Custom SVG icons
- **Inspiration**: Modern developer portfolios and terminal aesthetics

---

**Built with ❤️ and lots of ☕ by Vinit Dhatrak**
