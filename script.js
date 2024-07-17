document.addEventListener('DOMContentLoaded', function() {
    const username = 'admin';
    const password = 'password';

    const loginSection = document.getElementById('loginSection');
    const uploadSection = document.getElementById('uploadSection');
    const fileList = document.getElementById('fileList');
    const gallery = document.querySelector('.gallery');
    const logoutLink = document.getElementById('logout');
    const error = document.getElementById('error');

    function checkAuth() {
        if (localStorage.getItem('loggedIn') === 'true') {
            loginSection.classList.add('hidden');
            uploadSection.classList.remove('hidden');
            fileList.classList.remove('hidden');
            logoutLink.classList.remove('hidden');
            fetchFiles();
        } else {
            loginSection.classList.remove('hidden');
            uploadSection.classList.add('hidden');
            fileList.classList.add('hidden');
            logoutLink.classList.add('hidden');
        }
    }

    checkAuth();

    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const inputUsername = document.getElementById('username').value;
        const inputPassword = document.getElementById('password').value;

        if (inputUsername === username && inputPassword === password) {
            localStorage.setItem('loggedIn', 'true');
            error.textContent = '';
            checkAuth();
        } else {
            error.textContent = 'Invalid username or password';
        }
    });

    document.getElementById('logout').addEventListener('click', function() {
        localStorage.removeItem('loggedIn');
        checkAuth();
    });

    document.getElementById('uploadForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const fileInput = document.getElementById('fileToUpload');
        const files = fileInput.files;

        if (files.length > 0) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const fileData = {
                        name: file.name,
                        type: file.type,
                        url: e.target.result
                    };
                    const storedFiles = JSON.parse(localStorage.getItem('files')) || [];
                    storedFiles.push(fileData);
                    localStorage.setItem('files', JSON.stringify(storedFiles));
                    displayFile(fileData);
                };
                reader.readAsDataURL(file);
            });
        }
    });

    function fetchFiles() {
        gallery.innerHTML = '';
        const storedFiles = JSON.parse(localStorage.getItem('files')) || [];
        storedFiles.forEach(file => displayFile(file));
    }

    function displayFile(file) {
        const fileContainer = document.createElement('div');
        fileContainer.style.marginBottom = '20px';

        if (file.type.startsWith('image')) {
            const img = document.createElement('img');
            img.src = file.url;
            img.alt = file.name;
            fileContainer.appendChild(img);
        } else if (file.type.startsWith('video')) {
            const video = document.createElement('video');
            video.src = file.url;
            video.controls = true;
            fileContainer.appendChild(video);
        } else if (file.type === 'application/pdf') {
            const iframe = document.createElement('iframe');
            iframe.src = file.url;
            iframe.classList.add('pdf-viewer');
            fileContainer.appendChild(iframe);
        } else {
            const link = document.createElement('a');
            link.href = file.url;
            link.target = '_blank';
            link.textContent = file.name;
            fileContainer.appendChild(link);
        }

        gallery.appendChild(fileContainer);
    }
});
