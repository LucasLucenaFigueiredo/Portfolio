// Função para alternar entre os temas claro e escuro
function toggleTheme() {
  const body = document.body
  const currentTheme = body.getAttribute("data-theme") || "light"
  const newTheme = currentTheme === "light" ? "dark" : "light"

  body.setAttribute("data-theme", newTheme)
  localStorage.setItem("theme", newTheme)
}

// Função para aplicar o tema salvo ou o tema padrão
function applyTheme() {
  const savedTheme = localStorage.getItem("theme") || "light"
  document.body.setAttribute("data-theme", savedTheme)

  // Atualiza o estado do checkbox de acordo com o tema
  const themeToggle = document.getElementById("theme-toggle")
  if (themeToggle) {
    themeToggle.checked = savedTheme === "dark"
  }
}

// Função para animar as barras de habilidades quando visíveis
function animateSkillBars() {
  const skillSection = document.getElementById("skills")
  const skillBars = document.querySelectorAll(".skill-bar")

  // Função para verificar se um elemento está visível na tela
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect()
    return rect.top <= (window.innerHeight || document.documentElement.clientHeight) && rect.bottom >= 0
  }

  // Função para animar as barras quando visíveis
  function checkVisibility() {
    if (isElementInViewport(skillSection)) {
      skillBars.forEach((bar) => {
        const width = bar.style.width
        bar.style.width = "0"
        setTimeout(() => {
          bar.style.width = width
        }, 200)
      })
      // Remover o listener após a animação
      window.removeEventListener("scroll", checkVisibility)
    }
  }

  // Adicionar listener para o evento de scroll
  window.addEventListener("scroll", checkVisibility)
  // Verificar visibilidade inicial
  checkVisibility()
}

// Adicionar evento de clique ao botão de alternância de tema
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle")
  if (themeToggle) {
    themeToggle.addEventListener("change", toggleTheme)
  }

  // Aplicar o tema salvo
  applyTheme()

  // Animar as barras de habilidades
  animateSkillBars()

  // Inicializar navbar
  function initNavbar() {
    const navbar = document.getElementById("navbar")
    const navToggle = document.getElementById("nav-toggle")
    const navMenu = document.getElementById("nav-menu")
    const navLinks = document.querySelectorAll(".nav-link")

    let lastScrollTop = 0
    let ticking = false

    // Toggle do menu mobile
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active")
      navToggle.classList.toggle("active")
    })

    // Fechar menu ao clicar em um link
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active")
        navToggle.classList.remove("active")
      })
    })

    // Scroll suave para as seções
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const targetId = link.getAttribute("href")
        const targetSection = document.querySelector(targetId)

        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 70 // Compensar altura da navbar
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          })
        }
      })
    })

    // Destacar link ativo baseado na seção visível
    function updateActiveLink() {
      const sections = document.querySelectorAll("section, header")
      const scrollPos = window.scrollY + 100

      sections.forEach((section) => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.offsetHeight
        const sectionId = section.getAttribute("id")

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          navLinks.forEach((link) => {
            link.classList.remove("active")
            if (link.getAttribute("href") === `#${sectionId}`) {
              link.classList.add("active")
            }
          })
        }
      })
    }

    // Efeito de scroll da navbar
    function handleNavbarScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop

      // Adicionar classe 'scrolled' quando rolar
      if (scrollTop > 50) {
        navbar.classList.add("scrolled")
      } else {
        navbar.classList.remove("scrolled")
      }

      // Esconder/mostrar navbar baseado na direção do scroll
      if (scrollTop > lastScrollTop && scrollTop > 200) {
        // Scrolling down
        navbar.classList.add("hidden")
      } else {
        // Scrolling up
        navbar.classList.remove("hidden")
      }

      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop
      updateActiveLink()
    }

    // Otimizar performance do scroll com requestAnimationFrame
    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleNavbarScroll()
          ticking = false
        })
        ticking = true
      }
    }

    // Event listeners
    window.addEventListener("scroll", requestTick)
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        navMenu.classList.remove("active")
        navToggle.classList.remove("active")
      }
    })

    // Inicializar estado ativo
    updateActiveLink()
  }

  initNavbar()

  // Adicionar animações aos elementos quando ficam visíveis
  const sections = document.querySelectorAll(".section")

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  }

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  sections.forEach((section) => {
    section.style.opacity = "0"
    section.style.transform = "translateY(20px)"
    section.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out"
    observer.observe(section)
  })
})
