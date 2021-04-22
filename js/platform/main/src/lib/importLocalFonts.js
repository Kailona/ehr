export default function importLocalFonts(fontsPath) {
    if (!fontsPath) {
        return;
    }

    const { nunitosans } = fontsPath;
    const css =
        `
        @font-face {
          font-family: 'Nunito Sans';
          font-style: normal;
          font-weight: 400;
          src: url(${nunitosans}/pe0qMImSLYBIv1o4X1M8cceyI9tAcVwob5A.woff2) format('woff2');
          unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, ` +
        `U+1EA0-1EF9, U+20AB;
        }
        @font-face {
          font-family: 'Nunito Sans';
          font-style: normal;
          font-weight: 400;
          src: url(${nunitosans}/pe0qMImSLYBIv1o4X1M8ccezI9tAcVwob5A.woff2) format('woff2');
          unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, ` +
        `U+A720-A7FF;
        }
        @font-face {
          font-family: 'Nunito Sans';
          font-style: normal;
          font-weight: 400;
          src: url(${nunitosans}/pe0qMImSLYBIv1o4X1M8cce9I9tAcVwo.woff2) format('woff2');
          unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, ` +
        `U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
        }
    `;

    const style = document.createElement('style');
    const head = document.head || document.getElementsByTagName('head')[0];

    style['type'] = 'text/css';
    if (style['styleSheet']) {
        style['styleSheet'].cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
}
