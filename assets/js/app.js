(function () {
  const data = window.LAROLABBET_DATA;

  const getSubjectById = (id) => data.subjects.find((subject) => subject.id === id);
  const getAreaById = (subject, areaId) => subject?.areas.find((area) => area.id === areaId);
  const getFirstSubject = () => data.subjects[0];
  const getFirstArea = (subject) => subject?.areas?.[0];
  const byId = (id) => document.getElementById(id);

  const createTopMenu = () => {
    const menu = byId('subject-menu');
    if (!menu) return;

    menu.innerHTML = '';
    data.subjects.forEach((subject) => {
      const link = document.createElement('a');
      link.href = `subject.html?subject=${subject.id}`;
      link.className = 'subject-menu-link';
      link.textContent = subject.name;
      menu.appendChild(link);
    });
  };

  const createFooter = () => {
    const footerText = byId('footer-text');
    if (footerText) {
      footerText.textContent = data.site.footerText;
    }
  };

  const renderHomePage = () => {
    const grid = byId('home-subject-grid');
    if (!grid) return;

    const title = byId('site-title');
    const tagline = byId('site-tagline');
    title.textContent = data.site.name;
    tagline.textContent = data.site.tagline;

    data.subjects.forEach((subject) => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <img src="${subject.logo}" alt="Logga för ${subject.name}" class="logo" onerror="this.style.display='none'"/>
        <h2>${subject.name}</h2>
        <p>${subject.description}</p>
        <a class="button" href="subject.html?subject=${subject.id}">Öppna ämnet</a>
      `;
      grid.appendChild(card);
    });
  };

  const renderSubjectPage = () => {
    const container = byId('subject-area-grid');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const subjectId = params.get('subject');
    const subject = getSubjectById(subjectId) || getFirstSubject();
    const heading = byId('subject-heading');
    const description = byId('subject-description');

    if (!subject) {
      heading.textContent = 'Inga ämnen hittades';
      description.textContent = 'Lägg till minst ett ämne i content.js.';
      return;
    }

    if (!subjectId || !getSubjectById(subjectId)) {
      const fallbackHint = byId('subject-fallback-hint');
      if (fallbackHint) {
        fallbackHint.textContent = 'Ogiltig eller saknad ämneslänk. Visar första tillgängliga ämnet.';
      }
    }

    heading.textContent = subject.name;
    description.textContent = subject.description;

    subject.areas.forEach((area) => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <img src="${area.logo}" alt="Logga för ${area.title}" class="logo" onerror="this.style.display='none'"/>
        <h2>${area.title}</h2>
        <p>${area.summary}</p>
        <a class="button" href="topic.html?subject=${subject.id}&topic=${area.id}">Öppna område</a>
      `;
      container.appendChild(card);
    });
  };

  const renderSlideshow = (images = []) => {
    const slideshow = byId('slideshow');
    if (!slideshow) return;

    if (!images.length) {
      slideshow.innerHTML = '<p class="empty-state">Ingen slideshow tillagd ännu.</p>';
      return;
    }

    let index = 0;
    slideshow.innerHTML = `
      <div class="slideshow-image-wrap">
        <img id="slide-image" src="${images[0].src}" alt="${images[0].alt || 'Bild i slideshow'}" class="slide-image" onerror="this.style.display='none'"/>
      </div>
      <div class="slideshow-controls">
        <button id="prev-slide" class="button button-outline" type="button">Föregående</button>
        <span id="slide-counter">1 / ${images.length}</span>
        <button id="next-slide" class="button button-outline" type="button">Nästa</button>
      </div>
    `;

    const updateSlide = () => {
      const image = byId('slide-image');
      const counter = byId('slide-counter');
      image.src = images[index].src;
      image.alt = images[index].alt || `Bild ${index + 1}`;
      counter.textContent = `${index + 1} / ${images.length}`;
    };

    byId('prev-slide').addEventListener('click', () => {
      index = (index - 1 + images.length) % images.length;
      updateSlide();
    });

    byId('next-slide').addEventListener('click', () => {
      index = (index + 1) % images.length;
      updateSlide();
    });
  };

  const renderTopicPage = () => {
    const main = byId('topic-page');
    if (!main) return;

    const params = new URLSearchParams(window.location.search);
    const subjectId = params.get('subject');
    const topicId = params.get('topic');
    const subject = getSubjectById(subjectId) || getFirstSubject();
    const area = getAreaById(subject, topicId) || getFirstArea(subject);

    if (!subject || !area) {
      main.innerHTML = '<p>Inget område hittades. Lägg till minst ett område i content.js.</p>';
      return;
    }

    if (!subjectId || !topicId || !getSubjectById(subjectId) || !getAreaById(getSubjectById(subjectId), topicId)) {
      const fallbackHint = byId('topic-fallback-hint');
      if (fallbackHint) {
        fallbackHint.textContent = 'Ogiltig eller saknad områdeslänk. Visar första tillgängliga område.';
      }
    }

    byId('topic-breadcrumb').textContent = `${subject.name} / ${area.title}`;
    byId('topic-heading').textContent = area.title;
    byId('topic-summary').textContent = area.summary;

    const textContainer = byId('text-blocks');
    const videoContainer = byId('youtube-list');
    const pdfContainer = byId('pdf-list');

    if (area.content.textBlocks.length) {
      area.content.textBlocks.forEach((block) => {
        const article = document.createElement('article');
        article.className = 'content-block';
        article.innerHTML = `<h3>${block.heading}</h3><p>${block.body}</p>`;
        textContainer.appendChild(article);
      });
    } else {
      textContainer.innerHTML = '<p class="empty-state">Ingen text tillagd ännu.</p>';
    }

    if (area.content.youtubeEmbeds.length) {
      area.content.youtubeEmbeds.forEach((video) => {
        const section = document.createElement('article');
        section.className = 'content-block';
        section.innerHTML = `
          <h3>${video.title}</h3>
          <div class="video-wrap">
            <iframe src="${video.embedUrl}" title="${video.title}" loading="lazy" allowfullscreen></iframe>
          </div>
        `;
        videoContainer.appendChild(section);
      });
    } else {
      videoContainer.innerHTML = '<p class="empty-state">Ingen Youtube-video tillagd ännu.</p>';
    }

    if (area.content.pdfEmbeds.length) {
      area.content.pdfEmbeds.forEach((pdf) => {
        const section = document.createElement('article');
        section.className = 'content-block';
        section.innerHTML = `
          <h3>${pdf.title}</h3>
          <iframe src="${pdf.url}" class="pdf-frame" title="${pdf.title}"></iframe>
          <p><a href="${pdf.url}" target="_blank" rel="noopener">Öppna PDF i ny flik</a></p>
        `;
        pdfContainer.appendChild(section);
      });
    } else {
      pdfContainer.innerHTML = '<p class="empty-state">Ingen PDF tillagd ännu.</p>';
    }

    renderSlideshow(area.content.slideshowImages);
  };

  document.addEventListener('DOMContentLoaded', () => {
    createTopMenu();
    createFooter();
    renderHomePage();
    renderSubjectPage();
    renderTopicPage();
  });
})();
