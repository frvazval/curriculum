document.addEventListener('DOMContentLoaded', () => {

    const nombreEl = document.getElementById('nombre');
    const telefonoEl = document.getElementById('telefono');
    const emailEl = document.getElementById('email');
    const resumenContainer = document.getElementById('resumen');
    const experienciaContainer = document.getElementById('experiencia');
    const formacionContainer = document.getElementById('formacion');
    const aptitudesContainer = document.getElementById('aptitudes');
    const downloadBtn = document.getElementById('download-pdf-btn');

    // Cargar los datos del JSON
    async function loadResumeData() {
        try {
            const response = await fetch('cv.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            populateResume(data);
            makeEditable();
        } catch (error) {
            console.error("No se pudo cargar el archivo cv.json:", error);
            alert("Error: No se pudo cargar el archivo cv.json. Asegúrate de que el archivo existe en la misma carpeta y no tiene errores de formato.");
        }
    }

    // Volcar los datos en el HTML
    function populateResume(data) {
        // Cabecera y Contacto
        nombreEl.textContent = data.nombre;
        telefonoEl.textContent = `Tel: ${data.contacto.telefono}`;
        emailEl.textContent = `Email: ${data.contacto.email}`;
        
        // Resumen
        resumenContainer.innerHTML = data.resumen.map(p => `<p>${p}</p>`).join('');

        // Experiencia
        experienciaContainer.innerHTML = data.experiencia.map(job => `
            <div class="job">
                <h3>${job.puesto}</h3>
                <p class="job-company-duration">${job.empresa} (${job.duracion})</p>
                <ul>
                    ${job.responsabilidades.map(r => `<li>${r}</li>`).join('')}
                </ul>
            </div>
        `).join('');
        
        // Formación
        formacionContainer.innerHTML = data.formacion.map(course => `
            <div class="course">
                <h3>${course.titulo}</h3>
                <p class="course-institution">${course.institucion} (${course.anio})</p>
            </div>
        `).join('');

        // Aptitudes
        aptitudesContainer.innerHTML += data.aptitudes.map(category => `
            <div class="skill-category">
                <h4>${category.categoria}</h4>
                <ul>
                    ${category.items.map(item => `<li>${item}</li>`).join('')}
                </ul>
            </div>
        `).join('');
    }

    // Hacer todos los campos de texto editables
    function makeEditable() {
        const elementsToEdit = document.querySelectorAll('#resume h1, #resume h3, #resume h4, #resume p, #resume li');
        elementsToEdit.forEach(el => {
            el.setAttribute('contenteditable', 'true');
        });
    }
    
    // Ejemplo de cómo agregar la fuente Roboto a jsPDF
    const robotoFontBase64 = 'AAEAAAASAQAABAAgR0RFRrRCsIIAA...'; // Pega aquí el base64 de Roboto-Regular.ttf

    window.jsPDF = window.jspdf.jsPDF;

    const pdf = new jsPDF();
    pdf.addFileToVFS("Roboto-Regular.ttf", robotoFontBase64);
    pdf.addFont("Roboto-Regular.ttf", "Roboto", "normal");
    pdf.setFont("Roboto");

    // Funcionalidad de descarga PDF
    document.getElementById('download-pdf-btn').addEventListener('click', function () {
        document.fonts.ready.then(function () {
            const resume = document.querySelector("#resume");
            html2canvas(resume, {
                scale: 2 // mejora la calidad de la imagen
            }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new window.jspdf.jsPDF('p', 'pt', 'a4');
                // Calcula el tamaño proporcional para A4
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                // Ajusta la imagen para que ocupe toda la hoja A4
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save("curriculum.pdf");
            });
        });
    });

    // Iniciar la carga de datos
    loadResumeData();
});