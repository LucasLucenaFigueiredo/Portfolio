
function toggleTheme() {
  const body = document.body
  const currentTheme = body.getAttribute("data-theme") || "light"
  const newTheme = currentTheme === "light" ? "dark" : "light"

  body.setAttribute("data-theme", newTheme)
  localStorage.setItem("theme", newTheme)
}


function applyTheme() {
  const savedTheme = localStorage.getItem("theme") || "light"
  document.body.setAttribute("data-theme", savedTheme)

  
  const themeToggle = document.getElementById("theme-toggle")
  if (themeToggle) {
    themeToggle.checked = savedTheme === "dark"
  }
}


function animateSkillBars() {
  const skillSection = document.getElementById("skills")
  const skillBars = document.querySelectorAll(".skill-bar")

  
  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect()
    return rect.top <= (window.innerHeight || document.documentElement.clientHeight) && rect.bottom >= 0
  }

  
  function checkVisibility() {
    if (isElementInViewport(skillSection)) {
      skillBars.forEach((bar) => {
        const width = bar.style.width
        bar.style.width = "0"
        setTimeout(() => {
          bar.style.width = width
        }, 200)
      })
      
      window.removeEventListener("scroll", checkVisibility)
    }
  }

  
  window.addEventListener("scroll", checkVisibility)
  checkVisibility()
}


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

  // Contact form handling
  function initContactForm() {
    const form = document.getElementById('contact-form')
    if (!form) return

    const statusEl = document.getElementById('contact-status')

    function setStatus(message, type = 'info') {
      if (!statusEl) return
      statusEl.textContent = message
      statusEl.className = `contact-status ${type}`
    }

    function validateEmail(email) {
      // simples regex para validação básica
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault()

      const name = document.getElementById('contact-name').value.trim()
      const email = document.getElementById('contact-email').value.trim()
      const message = document.getElementById('contact-message').value.trim()

      if (!name || !email || !message) {
        setStatus('Por favor preencha todos os campos.', 'error')
        return
      }

      if (!validateEmail(email)) {
        setStatus('Por favor insira um e-mail válido.', 'error')
        return
      }

      setStatus('Enviando...', 'sending')

  const endpoint = form.getAttribute('data-endpoint') || ''
  const emailjsService = form.getAttribute('data-emailjs-service') || ''
  const emailjsTemplate = form.getAttribute('data-emailjs-template') || ''
  const emailjsKey = form.getAttribute('data-emailjs-key') || ''

      try {
        // Priority 1: EmailJS (envio direto sem abrir cliente)
        if (emailjsService && emailjsTemplate && emailjsKey) {
          // carregar SDK dinamicamente se necessário
          if (typeof emailjs === 'undefined') {
            await new Promise((resolve, reject) => {
              const script = document.createElement('script')
              script.src = 'https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js'
              script.onload = () => resolve()
              script.onerror = reject
              document.head.appendChild(script)
            })
          }

          // inicializar
          if (emailjs && !emailjs.init.__initialized) {
            try {
              emailjs.init(emailjsKey)
              // marcar como inicializado para evitar reinit
              emailjs.init.__initialized = true
            } catch (e) {
              // alguns builds expõem emailjs as default
              if (emailjs.default && emailjs.default.init) {
                emailjs.default.init(emailjsKey)
                emailjs.default.init.__initialized = true
              }
            }
          }

          const templateParams = { from_name: name, from_email: email, message }
          const sendFn = (emailjs && emailjs.send) ? emailjs.send.bind(emailjs) : (emailjs.default && emailjs.default.send) ? emailjs.default.send.bind(emailjs.default) : null

          if (!sendFn) throw new Error('SDK do EmailJS não pôde ser carregado')

          const res = await sendFn(emailjsService, emailjsTemplate, templateParams)
          // EmailJS responde com um objeto, mas não é sempre consistente — assumimos sucesso se não lançar
          setStatus('Mensagem enviada com sucesso. Obrigado!', 'success')
          form.reset()
          return
        }

        // Priority 2: endpoint remoto (Formspree, Getform...)
        if (endpoint) {
          // Enviar via fetch para Formspree ou endpoint compatível
          const payload = {
            name,
            email,
            message,
          }

          const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify(payload),
          })

          if (res.ok) {
            setStatus('Mensagem enviada com sucesso. Obrigado!', 'success')
            form.reset()
          } else {
            const data = await res.json().catch(() => ({}))
            const err = data.error || data.message || 'Erro ao enviar. Tente novamente mais tarde.'
            throw new Error(err)
          }
        } else {
          // Fallback: abrir client de email com mailto (funciona localmente)
          const subject = encodeURIComponent(`Contato via portfólio: ${name}`)
          const body = encodeURIComponent(`Nome: ${name}%0AEmail: ${email}%0AMensagem:%0A${message}`)
          window.location.href = `mailto:${encodeURIComponent('lucaslucenaaa32@gmail.com')}?subject=${subject}&body=${body}`
          setStatus('Seu cliente de email foi aberto. Conclua o envio no seu programa de email.', 'info')
        }
      } catch (err) {
        console.error(err)
        setStatus(`Erro: ${err.message || 'Não foi possível enviar a mensagem.'}`, 'error')
      }
    })
  }

  initContactForm()

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
