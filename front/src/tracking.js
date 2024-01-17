import Bowser from 'bowser'
import getBrowserFingerprint from 'get-browser-fingerprint'

class TrackingComponent extends HTMLElement {
  constructor () {
    super()
    this.shadow = this.attachShadow({ mode: 'open' })
    this.fingerprint = null
    this.pageHeigth = null
    this.path = null
    this.startTime = null

    document.addEventListener('DOMContentLoaded', () => {
      this.screenHeigth = window.innerHeight
      this.screenWidth = window.innerWidth
      this.path = window.location.pathname
      this.startTime = Date.now()

      this.generateFingerprint()
      this.trackingScroll()
      this.trackingMouse()
      this.trackingUnload()

      if (window.DeviceMotionEvent) {
        this.trackingMobilePosition()
      }

      const data = {
        event: 'load',
        path: this.path,
        eventTime: this.startTime,
        screenHeigth: this.screenHeigth,
        pageHeigth: document.documentElement.scrollHeight,
        screenWidth: this.screenWidth,
        fingerprint: this.fingerprint
      }

      // fetch(`${import.meta.env.VITE_import.meta.env.VITE_API_URL}user-trackings`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ data: data })
      // })
      // .then(response => response.json())
      // .then(data => console.log(data))
      // .catch((error) => console.error('Error:', error));
    })
  }

  generateFingerprint = () => {
    this.fingerprint = getBrowserFingerprint()

    const userAgent = Bowser.parse(window.navigator.userAgent)

    const data = {
      fingerprint: this.fingerprint,
      browser: userAgent.browser.name,
      browserVersion: userAgent.browser.version,
      os: userAgent.os.name,
      osVersion: userAgent.os.version,
      screenHeigth: this.screenHeigth,
      screenWidth: this.screenWidth
    }

    // fetch(`${import.meta.env.VITE_import.meta.env.VITE_API_URL}fingerprints`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ data: data })
    // })
    // .then(response => response.json())
    // .then(data => console.log(data))
    // .catch((error) => console.error('Error:', error));

    document.dispatchEvent(new CustomEvent('setFingerprint', {
      detail: {
        fingerprint: this.fingerprint
      }
    }))
  }

  hashCode (str) {
    let hash = 0

    if (str.length === 0) {
      return hash
    }

    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }

    hash = Math.abs(hash)

    return hash
  }

  trackingScroll = () => {
    let scrollEnd = null
    let scrollStartTime = null
    let scrollEndTime = null
    let scrollTimer = null

    document.addEventListener('wheel', (event) => {
      scrollStartTime = Date.now()
    })

    document.addEventListener('scroll', () => {
      clearTimeout(scrollTimer)

      scrollTimer = setTimeout(() => {
        clearTimeout(scrollTimer)

        scrollEnd = window.scrollY
        scrollEndTime = Date.now()

        const data = {
          event: 'scroll',
          path: this.path,
          eventTime: scrollStartTime,
          screenHeigth: this.screenHeigth,
          screenWidth: this.screenWidth,
          pageHeigth: document.documentElement.scrollHeight,
          scrollEnd: scrollEnd + this.screenHeigth,
          scrollStartTime,
          scrollEndTime,
          fingerprint: this.fingerprint
        }

        fetch(`${import.meta.env.VITE_import.meta.env.VITE_API_URL}user-trackings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ data })
        })
          .then(response => response.json())
          .then(data => console.log(data))
          .catch((error) => console.error('Error:', error))
      }, 200)
    })
  }

  trackingMouse = () => {
    const handleMouseStart = event => {
      const data = {
        event: 'click',
        path: this.path,
        eventTime: Date.now(),
        screenHeigth: this.screenHeigth,
        screenWidth: this.screenWidth,
        pageHeigth: document.documentElement.scrollHeight,
        mouseStarX: event.clientX + window.scrollX,
        mouseStartY: event.clientY + window.scrollY,
        fingerprint: this.fingerprint
      }

      fetch(`${import.meta.env.VITE_import.meta.env.VITE_API_URL}user-trackings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data })
      })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch((error) => console.error('Error:', error))
    }

    const handleTouchStart = event => {
      const touch = event.changedTouches[0]

      const data = {
        event: 'click',
        path: this.path,
        eventTime: Date.now(),
        screenHeigth: this.screenHeigth,
        screenWidth: this.screenWidth,
        pageHeigth: document.documentElement.scrollHeight,
        mouseStartX: touch.clientX + window.scrollX,
        mouseStartY: touch.clientY + window.scrollY,
        fingerprint: this.fingerprint
      }

      fetch(`${import.meta.env.VITE_import.meta.env.VITE_API_URL}user-trackings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data })
      })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch((error) => console.error('Error:', error))
    }

    const handleMouseEnd = event => {
      if (window.getSelection().toString()) {
        const data = {
          event: 'select',
          path: this.path,
          eventTime: Date.now(),
          text: window.getSelection().toString(),
          screenHeigth: this.screenHeigth,
          screenWidth: this.screenWidth,
          pageHeigth: document.documentElement.scrollHeight,
          mouseEndX: event.clientX + window.scrollX,
          mouseEndY: event.clientY + window.scrollY,
          fingerprint: this.fingerprint
        }

        fetch(`${import.meta.env.VITE_import.meta.env.VITE_API_URL}user-trackings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ data })
        })
          .then(response => response.json())
          .then(data => console.log(data))
          .catch((error) => console.error('Error:', error))
      }
    }

    const handleTouchEnd = event => {
      if (window.getSelection().toString()) {
        data = {
          event: 'select',
          path: this.path,
          eventTime: Date.now(),
          screenHeigth: this.screenHeigth,
          screenWidth: this.screenWidth,
          pageHeigth: document.documentElement.scrollHeight,
          mouseEndX: event.clientX + window.scrollX,
          mouseEndY: event.clientY + window.scrollY,
          fingerprint: this.fingerprint
        }

        fetch(`${import.meta.env.VITE_import.meta.env.VITE_API_URL}user-trackings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ data })
        })
          .then(response => response.json())
          .then(data => console.log(data))
          .catch((error) => console.error('Error:', error))
      }
    }

    document.addEventListener('mousedown', handleMouseStart)
    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('mouseup', handleMouseEnd)
    document.addEventListener('touchend', handleTouchEnd)
  }

  trackingMobilePosition = () => {
    let lastX = 0
    let lastY = 0
    let lastZ = 0
    const threshold = 1.0

    window.addEventListener('devicemotion', event => {
      const acceleration = event.accelerationIncludingGravity
      const x = acceleration.x
      const y = acceleration.y
      const z = acceleration.z

      const deltaX = Math.abs(x - lastX)
      const deltaY = Math.abs(y - lastY)
      const deltaZ = Math.abs(z - lastZ)

      if (deltaX > threshold || deltaY > threshold || deltaZ > threshold) {
        lastX = x
        lastY = y
        lastZ = z

        const data = {
          event: 'mobileOrientation',
          path: this.path,
          eventTime: Date.now(),
          screenHeigth: this.screenHeigth,
          screenWidth: this.screenWidth,
          pageHeigth: this.pageHeigth,
          mobileX: x,
          mobileY: y,
          mobileZ: z,
          fingerprint: this.fingerprint
        }

        fetch(`${import.meta.env.VITE_import.meta.env.VITE_API_URL}user-trackings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ data })
        })
          .then(response => response.json())
          .then(data => console.log(data))
          .catch((error) => console.error('Error:', error))
      }
    })
  }

  trackingUnload = () => {
    window.addEventListener('beforeunload', event => {
      const data = {
        event: 'unload',
        path: this.path,
        eventTime: Date.now(),
        sessionDuration: Date.now() - this.startTime,
        screenHeigth: this.screenHeigth,
        screenWidth: this.screenWidth,
        pageHeigth: document.documentElement.scrollHeight,
        fingerprint: this.fingerprint
      }

      fetch(`${import.meta.env.VITE_import.meta.env.VITE_API_URL}user-trackings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data })
      })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch((error) => console.error('Error:', error))
    })
  }
}

customElements.define('tracking-component', TrackingComponent)

new TrackingComponent()
