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

editor.session.on("change", function() {
    iframe.srcdoc = editor.getValue();
});