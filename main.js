(function () {
  // Número público do cadastro da IA PhD. Troque aqui se o canal da campanha for outro.
  var WHATSAPP = "5582981909072";

  var root = document.documentElement;
  var choices = document.querySelectorAll(".choice");

  function syncChoices() {
    var perfil = root.dataset.perfil;
    choices.forEach(function (choice) {
      var selected = choice.dataset.perfil === perfil;
      if (selected) choice.setAttribute("aria-current", "true");
      else choice.removeAttribute("aria-current");
    });
  }

  function selectPerfil(perfil, fromCampaignClick) {
    root.dataset.perfil = perfil;
    syncChoices();
    if (root.dataset.campanha === "true" || fromCampaignClick) {
      var url = new URL(location.href);
      url.searchParams.set("perfil", perfil);
      history.replaceState(null, "", url);
      root.dataset.campanha = "true";
      document.title = perfil === "empresario"
        ? "IA PhD — Para empresários"
        : "IA PhD — Para profissionais";
    }
  }

  choices.forEach(function (choice) {
    choice.addEventListener("click", function (event) {
      event.preventDefault();
      selectPerfil(choice.dataset.perfil, root.dataset.campanha === "true");
    });
  });

  syncChoices();

  var form = document.getElementById("form-conversa");
  var status = document.getElementById("form-status");
  var fallback = document.getElementById("form-fallback");
  var waLink = document.getElementById("wa-link");

  function setError(id, message) {
    var input = document.getElementById(id);
    var slot = document.getElementById("erro-" + id);
    if (message) {
      input.setAttribute("aria-invalid", "true");
      slot.hidden = false;
      slot.textContent = message;
    } else {
      input.removeAttribute("aria-invalid");
      slot.hidden = true;
      slot.textContent = "";
    }
  }

  function offerCopy() {
    var oferta = root.dataset.oferta || "";
    if (oferta === "imersao-0512") {
      return {
        origem: "Olá, IA PhD. Cheguei pela página da Imersão de 5 de dezembro.",
        pedido: "Quero participar da Imersão especializada de 5 de dezembro de 2026."
      };
    }
    if (oferta === "immersion") {
      return {
        origem: "Olá, IA PhD. Cheguei pela página da Immersion.",
        pedido: "Quero conhecer a Immersion."
      };
    }
    if (oferta === "practitioner") {
      return {
        origem: "Olá, IA PhD. Cheguei pela página do Agentic Practitioner.",
        pedido: "Quero conhecer o Agentic Practitioner."
      };
    }
    return {
      origem: "Olá, IA PhD. Cheguei pela landing da Era Agêntica.",
      pedido: root.dataset.perfil === "empresario"
        ? "Quero um diagnóstico ou uma conversa estratégica."
        : "Quero ampliar minhas capacidades e inscrever meu interesse na Imersão."
    };
  }

  function messageFor(data) {
    var copy = offerCopy();
    var perfil = root.dataset.perfil === "empresario" ? "empresário" : "profissional";
    var lines = [
      copy.origem,
      "Perfil: " + perfil + ".",
      copy.pedido,
      "Nome: " + data.nome,
      "E-mail: " + data.email,
      "WhatsApp: " + data.telefone
    ];
    if (data.organizacao) lines.push("Organização: " + data.organizacao);
    if (data.funcao) lines.push("Função a estruturar: " + data.funcao);
    return lines.join("\n");
  }

  if (form) form.addEventListener("submit", function (event) {
    event.preventDefault();
    var nome = form.nome.value.trim();
    var email = form.email.value.trim();
    var telefone = form.telefone.value.trim();
    var ok = true;

    setError("nome", nome ? "" : "Informe seu nome.");
    setError("email", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Informe um e-mail válido.");
    setError("telefone", telefone.replace(/\D/g, "").length >= 10 ? "" : "Informe um WhatsApp com DDD.");
    if (!nome || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || telefone.replace(/\D/g, "").length < 10) {
      ok = false;
    }
    if (!ok) {
      status.hidden = false;
      status.textContent = "Revise os campos destacados para abrir a conversa.";
      fallback.hidden = true;
      return;
    }

    var text = messageFor({
      nome: nome,
      email: email,
      telefone: telefone,
      organizacao: form.organizacao.value.trim(),
      funcao: form.funcao.value.trim()
    });

    if (!WHATSAPP) {
      status.hidden = false;
      status.textContent = "O canal de conversa ainda não está configurado. Copie a mensagem e envie à IA PhD.";
      fallback.hidden = true;
      if (navigator.clipboard) navigator.clipboard.writeText(text);
      return;
    }

    var url = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(text);
    waLink.href = url;
    fallback.hidden = false;
    status.hidden = false;
    status.textContent = "Mensagem pronta. Se o WhatsApp não abrir, use o link abaixo.";

    var opener = document.createElement("a");
    opener.href = url;
    opener.target = "_blank";
    opener.rel = "noopener noreferrer";
    document.body.appendChild(opener);
    opener.click();
    opener.remove();
  });

  var alertBox = document.getElementById("imersao-alert");
  var bar = document.getElementById("imersao-bar");
  var dismiss = document.getElementById("imersao-seguir");
  var visitKey = "iaphd-imersao-0512";

  function showBar() {
    if (!bar) return;
    bar.hidden = false;
    root.dataset.imersaoBar = "on";
  }

  if (alertBox && bar) {
    if (sessionStorage.getItem(visitKey) === "1") {
      showBar();
    } else {
      alertBox.showModal();
    }
    alertBox.addEventListener("close", function () {
      sessionStorage.setItem(visitKey, "1");
      showBar();
    });
    if (dismiss) {
      dismiss.addEventListener("click", function () {
        alertBox.close();
      });
    }
  }
})();
