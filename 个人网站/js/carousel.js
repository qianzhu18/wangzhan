document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.carousel-slide');
    const prevButton = document.querySelector('.carousel-button.prev');
    const nextButton = document.querySelector('.carousel-button.next');
    const thumbnailsContainer = document.querySelector('.carousel-thumbnails');
    
    let currentSlide = 0;
    let isAnimating = false;

    // 创建缩略图
    slides.forEach((slide, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.classList.add('carousel-thumbnail');
        thumbnail.style.cssText = `
            width: 60px;
            height: 40px;
            background-image: url(${slide.querySelector('img').src});
            background-size: cover;
            cursor: pointer;
            border: 2px solid white;
            border-radius: 4px;
            transition: all 0.3s ease;
        `;
        
        thumbnail.addEventListener('click', () => {
            if (!isAnimating) {
                showSlide(index);
            }
        });
        
        thumbnailsContainer.appendChild(thumbnail);
    });

    function showSlide(index) {
        if (isAnimating) return;
        isAnimating = true;

        slides[currentSlide].classList.remove('active');
        slides[currentSlide].style.opacity = 0;
        
        currentSlide = index;
        
        slides[currentSlide].classList.add('active');
        slides[currentSlide].style.opacity = 1;

        updateThumbnails();
        
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }

    function updateThumbnails() {
        const thumbnails = document.querySelectorAll('.carousel-thumbnail');
        thumbnails.forEach((thumbnail, index) => {
            if (index === currentSlide) {
                thumbnail.style.border = '2px solid var(--accent-color)';
                thumbnail.style.boxShadow = '0 0 10px var(--accent-color)';
            } else {
                thumbnail.style.border = '2px solid white';
                thumbnail.style.boxShadow = 'none';
            }
        });
    }

    function nextSlide() {
        if (!isAnimating) {
            showSlide((currentSlide + 1) % slides.length);
        }
    }

    function prevSlide() {
        if (!isAnimating) {
            showSlide((currentSlide - 1 + slides.length) % slides.length);
        }
    }

    // 事件监听器
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);

    // 自动轮播
    let autoplayInterval = setInterval(nextSlide, 5000);

    // 鼠标悬停时暂停自动轮播
    const carouselContainer = document.querySelector('.carousel');
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });

    carouselContainer.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(nextSlide, 5000);
    });

    // 键盘控制
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });

    // 初始化缩略图状态
    updateThumbnails();
}); 