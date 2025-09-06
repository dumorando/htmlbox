const iframe = document.querySelector("iframe");
const defaulthtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>`;

const editor = ace.edit("editor", {
    theme: 'ace/theme/textmate',
    mode: 'ace/mode/html',
    value: defaulthtml
});

iframe.srcdoc = editor.getValue();

editor.session.on("change", function() {
    iframe.srcdoc = editor.getValue();
});

const container = document.querySelector('.container');
const editorPane = document.getElementById('editor');
const iframeContainer = document.getElementById('iframe-container');
const divider = document.getElementById('divider');

const DIVIDER_WIDTH = 6;
const HALF_DIV = DIVIDER_WIDTH / 2;
const MIN_PX = 200;
let leftRatio = 0.5;

function applyLayout() {
    editorPane.style.width = `calc(${(leftRatio * 100).toFixed(4)}% - 3px)`;
    iframeContainer.style.width = `calc(${((1 - leftRatio) * 100).toFixed(4)}% - 3px)`;
    editor.resize();
}

function startResize() {
    document.body.classList.add('resizing');
}

function endResize() {
    document.body.classList.remove('resizing');
    editor.resize();
}

function onPointerMove(clientX) {
    const rect = container.getBoundingClientRect();
    let leftPx = clientX - rect.left;
    leftPx = Math.max(leftPx, MIN_PX + HALF_DIV);
    leftPx = Math.min(leftPx, rect.width - (MIN_PX + HALF_DIV));
    leftRatio = leftPx / rect.width;
    applyLayout();
}

divider.addEventListener('mousedown', (e) => {
    e.preventDefault();
    startResize();
    const move = (ev) => onPointerMove(ev.clientX);
    const up = () => {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
        endResize();
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up, { once: true });
});

divider.addEventListener('touchstart', (e) => {
    e.preventDefault();
    startResize();
    const move = (ev) => {
        if (ev.touches && ev.touches.length) {
            onPointerMove(ev.touches[0].clientX);
        }
    };
    const end = () => {
        document.removeEventListener('touchmove', move);
        document.removeEventListener('touchend', end);
        endResize();
    };
    document.addEventListener('touchmove', move, { passive: false });
    document.addEventListener('touchend', end, { once: true });
}, { passive: false });

window.addEventListener('resize', applyLayout);

applyLayout();