
export const fileDownload = (fileUrl, name) => {
    fetch(`http://localhost:8800/${fileUrl}`)
        .then(response => {
            response.blob().then(blob => {
                let url = window.URL.createObjectURL(blob);
                let a = document.createElement('a');
                a.href = url;
                a.download = name;
                a.click();
            });
            //window.location.href = response.url;
        });
}