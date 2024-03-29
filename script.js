// Fade-in effect on scroll
document.addEventListener("DOMContentLoaded", function() {
    window.addEventListener("scroll", () => {
        let sections = document.querySelectorAll(".section");
        sections.forEach(section => fadeInSection(section));
    });

    // Initial fade-in for the first section, if present
    fadeInSection(document.querySelector(".section"));

    // Fetch problem sets if on problem_sets.html
    if (window.location.pathname.endsWith('problem_sets.html')) {
        fetchProblemSets();
    }
});

function fadeInSection(section) {
    if (section) {
        let sectionTop = section.getBoundingClientRect().top;
        let sectionBottom = section.getBoundingClientRect().bottom;

        if (sectionTop < window.innerHeight && sectionBottom > 0) {
            section.style.opacity = 1;
        } else {
            section.style.opacity = 0;
        }
    }
}

// Fetch and display problem sets
function fetchProblemSets() {
    const repoOwner = 'agastyahukoo'; // Replace with your GitHub username
    const repoName = 'CodeChamp'; // Replace with your repository name
    const problemsPath = 'problems'; // The folder where your problems are stored

    fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${problemsPath}`)
        .then(response => response.json())
        .then(data => {
            const fileListElement = document.getElementById('file-list');
            if (fileListElement) {
                fileListElement.innerHTML = '';
                data.forEach(item => {
                    if (item.type === 'file' && item.name.endsWith('.txt')) {
                        const listItem = document.createElement('li');
                        const link = document.createElement('a');
                        link.textContent = item.name;
                        link.href = `problem_template.html?problem=${item.name}`;
                        listItem.appendChild(link);
                        fileListElement.appendChild(listItem);
                    }
                });
            }
        })
        .catch(error => console.error('Error fetching problem sets:', error));
}

// Search for files
function searchFile() {
    let input = document.getElementById('searchInput');
    let filter = input.value.toUpperCase();
    let ul = document.getElementById('file-list');
    let li = ul.getElementsByTagName('li');

    for (let i = 0; i < li.length; i++) {
        let a = li[i].getElementsByTagName('a')[0];
        let txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

// Load a specific problem based on URL parameters (for problem_template.html)
function loadProblemContent() {
    const urlParams = new URLSearchParams(window.location.search);
    const problemName = urlParams.get('problem');
    if (problemName) {
        const repoOwner = 'agastyahukoo'; // Replace with your GitHub username
        const repoName = 'CodeChamp'; // Replace with your repository name
        const problemsPath = 'problems'; // The folder where your problems are stored

        fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${problemsPath}/${problemName}`)
            .then(response => response.json())
            .then(data => {
                if (data.content) {
                    const problemContent = atob(data.content);
                    document.getElementById('problem-description').textContent = problemContent;
                    document.getElementById('problem-title').textContent = problemName;
                }
            })
            .catch(error => console.error('Error loading problem:', error));
    }
}

// Load problem content if on problem_template.html
if (window.location.pathname.endsWith('problem_template.html')) {
    loadProblemContent();
}
