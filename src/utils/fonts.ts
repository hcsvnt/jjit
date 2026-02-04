import localFont from 'next/font/local';


const IBMFont = localFont({
    src: [
        {
            path: '../assets/IBM_VGA.woff',
            weight: '400',
            style: 'normal'
        },

    ],
    variable: '--font-primary',
    fallback: ['monospace']
});

const fonts = { IBMFont };
export default fonts;
