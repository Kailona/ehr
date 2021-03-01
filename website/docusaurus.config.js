module.exports = {
    title: 'Kailona',
    tagline: `Personal Health Record`,
    url: 'https://docs.kailona.org',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',
    organizationName: 'Kailona',
    projectName: 'KailonaEHR',
    scripts: ['/js/matomo-tracking.js'],
    themeConfig: {
        colorMode: {
            disableSwitch: false,
        },
        navbar: {
            title: '',
            logo: {
                alt: 'Kailona',
                src: 'img/logo.svg',
            },
            items: [
                {
                    href: 'https://app.kailona.org',
                    label: 'Live (Alpha)',
                    position: 'right',
                },
                {
                    href: 'https://github.com/kailona/ehr',
                    label: 'Source Code',
                    position: 'right',
                },
                {
                    href: 'https://help.kailona.org',
                    label: 'Need help?',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'light',
            links: [
                {
                    title: 'Docs',
                    items: [
                        {
                            label: 'Architecture',
                            to: 'docs/development/architecture',
                        },
                        {
                            label: 'Plugins',
                            to: 'docs/development/plugins',
                        },
                        {
                            label: 'FAQ',
                            to: 'docs/faq',
                        },
                        {
                            label: 'FHIR®',
                            href: 'https://hl7.org/fhir',
                        },
                    ],
                },
                {
                    title: 'Community',
                    items: [
                        {
                            label: 'Forum',
                            href: 'https://help.kailona.org',
                        },
                        {
                            label: 'Twitter',
                            href: 'https://twitter.com/kailonahealth',
                        },
                    ],
                },
                {
                    title: 'Sponsors',
                    items: [
                        {
                            label: 'Nextcloud',
                            href: 'https://nextcloud.com',
                        },
                        {
                            label: 'MEDKEN®',
                            href: 'https://medken.com',
                        },
                        {
                            label: 'ACANIO',
                            href: 'https://acanio.com',
                        },
                        {
                            label: 'TOCA',
                            href: 'https://toca.com',
                        },
                        {
                            label: 'amberPRO',
                            href: 'https://amberpro.net',
                        },
                        {
                            html: `
                                <div style="padding: 20px 0;">
                                    <a href="https://www.netlify.com" target="_blank">
                                      <img
                                        src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg"
                                        alt="Deployed by Netlify"
                                        width="100px"
                                      />
                                    </a>                                
                                </div>
                            `,
                        },
                    ],
                },
            ],
            copyright: `
                <div class="sponsors-section" style="margin-top: 30px; padding: 
                            30px 10px 10px 10px; background-color: #f5f6f7; display: flex; 
                            align-items: center; flex-direction: column;">
                    <div class="major-sponsors">
                        <a href="https://www.bmbf.de/en/" target="_blank">
                            <img src="/img/Logo_BMBF.svg" height="80px" />
                        </a>
                        <a href="https://www.okfn.de/en/" target="_blank">
                            <img src="/img/logo-okfn.svg" height="80px" 
                                style="margin-left: 50px; margin-right: 50px;" />
                        </a>
                        <a href="https://prototypefund.de/en/" target="_blank">
                            <img src="/img/PrototypeFund-P-Logo.svg" height="80px" />
                        </a>
                    </div>
                    <div class="complimentary-sponsors">
                        <a class="sponsor-nextcloud" href="https://nextcloud.com" target="_blank">
                            <img src="/img/nextcloud.svg" />
                        </a>
                        <a class="sponsor-medken" href="https://medken.com" target="_blank">
                            <img src="/img/medken.svg" />
                        </a>
                        <a class="sponsor-acanio" href="https://acanio.com" target="_blank">
                            <img src="/img/acanio.svg" />
                        </a>
                        <a class="sponsor-toca" href="https://toca.com" target="_blank">
                            <img src="/img/toca.svg" />
                        </a>
                        <a class="sponsor-amberPRO" href="https://amberpro.net" target="_blank">
                              <img src="/img/AmberPRObyLatticeWork.svg"/>
                        </a>   
                    </div>
                </div>
                <div style="margin-top: 10px;">
                    Copyright © Kailona™ ${new Date().getFullYear()} | Protect, Control and Keep Track of Your Health Data
                </div>
                <div style="margin-top: 10px; font-size: 12px;">
                    <div>
                        FHIR® is the registered trademark of Health Level Seven International and the use does not 
                        constitute endorsement by HL7. IBM® is a trademark of International Business Machines 
                        Corporation, registered in many jurisdictions worldwide. MEDKEN® is the registered trademark 
                        of MEDKEN LLC.
                    </div>
                </div>
            `,
        },
    },
    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    editUrl: 'https://github.com/kailona/ehr/edit/main/website/',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            },
        ],
    ],
};
