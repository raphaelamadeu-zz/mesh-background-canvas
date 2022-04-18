window.addEventListener("load", () => {
  const canvas = canvas1;
  const ctx = canvas.getContext("2d");

  let linesDistance = 500;
  let particleCount = 150;

  canvasPosition = canvas.getBoundingClientRect();

  canvas.height = canvasPosition.height;
  canvas.width = canvasPosition.width;

  const dots = [];

  const mouse = {
    x: 0,
    y: 0,
    size: 100,
    onScreen: false
  };

  class Dot {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.dy =
        Math.random() < 0.5
          ? -Math.floor(Math.random() * 3 + 1)
          : Math.floor(Math.random() * 3 + 1);
      this.dx =
        Math.random() < 0.5
          ? -Math.floor(Math.random() * 3)
          : Math.floor(Math.random() * 3);

      this.size = 5;
      this.speed = 0.2;
    }
    update() {
      if (this.x - this.size < 0 || this.x + this.size > canvas.width)
        this.dx = -this.dx;

      if (this.y - this.size < 0 || this.y + this.size > canvas.height)
        this.dy = -this.dy;

      if (mouse.onScreen && getDistance(this, mouse) < mouse.size) {
        if (mouse.x < this.x && this.x + this.size < canvas.width) this.x += 5;
        else if (mouse.x > this.x && this.x + this.size > 0) this.x -= 5;

        if (mouse.y < this.y && this.y + this.size < canvas.height) this.y += 5;
        else if (mouse.y > this.y && this.y - this.size > 0) this.y -= 5;
      }

      this.x += this.dx * this.speed;
      this.y += this.dy * this.speed;
    }
    draw() {
      ctx.beginPath();
      ctx.fillStyle = "rgb(150,0,255)";
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function handleDots() {
    for (let i = 0; i < dots.length; i++) {
      dots[i].update();
      dots[i].draw();
    }
  }

  function init() {
    dots.splice(0, dots.length);

    for (let i = 0; i < particleCount; i++) {
      dots.push(
        new Dot(Math.random() * canvas.width, Math.random() * canvas.height)
      );
    }

    canvas.addEventListener("mousemove", (e) => {
      mouse.onScreen = true;
      mouse.x =
        ((e.x - canvasPosition.left) * canvas.width) / canvasPosition.width;
      mouse.y =
        ((e.y - canvasPosition.top) * canvas.height) / canvasPosition.height;
    });

    canvas.addEventListener("mouseout", () => {
      mouse.onScreen = false;
    });

    window.addEventListener("resize", () => {
      canvasPosition = canvas.getBoundingClientRect();

      canvas.height = canvasPosition.height;
      canvas.width = canvasPosition.width;
      input1.max = canvasPosition.width;
    });

    input1.max = canvasPosition.width;
    input1.addEventListener("change", (e) => {
      linesDistance = e.target.value;
    });

    count.innerText = `Particle count: ${particleCount}`;
    input2.value = particleCount;
    input2.addEventListener("change", (e) => {
      const newValue = e.target.value;
      if (newValue > particleCount) {
        for (let i = 0; i < newValue - particleCount; i++) {
          dots.push(
            new Dot(Math.random() * canvas.width, Math.random() * canvas.height)
          );
        }
      } else {
        if (dots.length > 0) {
          dots.splice(0, dots.length - newValue);
        }
      }

      particleCount = newValue;
      count.innerText = `Particle count: ${particleCount}`;
    });
  }

  function getDistance(a, b) {
    const x = a.x - b.x;
    const y = a.y - b.y;

    return Math.sqrt(x * x + y * y);
  }

  function connect() {
    for (let a = 0; a < dots.length; a++) {
      for (let b = a; b < dots.length; b++) {
        const distance = getDistance(dots[a], dots[b]);

        1 - distance / linesDistance;

        if (distance < linesDistance) {
          ctx.strokeStyle = `rgba(150,0,255,${1 - distance / linesDistance})`;
          ctx.beginPath();
          ctx.moveTo(dots[a].x, dots[a].y);
          ctx.lineTo(dots[b].x, dots[b].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleDots();
    connect();
  }

  init();
  animate();
});
