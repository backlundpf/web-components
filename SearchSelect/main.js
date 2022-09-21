customElements.define(
  "search-in-select",
  class extends HTMLElement {
    constructor() {
      super();

      const template = document.getElementById("search-in-select-template");
      const templateContent = template.content;

      this.attachShadow({ mode: "open" }).appendChild(
        templateContent.cloneNode(true)
      );
    }

    connectedCallback() {
      this.shadowRoot
        .getElementById("search-input")
        .addEventListener("change", (e) => {
          console.log(e.target.value);
        });
      console.log(this);
    }

    disconnectedCallback() {
      this.shadowRoot.getElementById("search-input").removeEventListener();
    }
  }
);

customElements.define(
  "search-select",
  class extends HTMLElement {
    constructor() {
      super();

      this.selectableItems = [];

      const template = document.getElementById("search-select-template");
      const templateContent = template.content;
      this.templateContent;

      this.attachShadow({ mode: "open" }).appendChild(
        templateContent.cloneNode(true)
      );

      this.searchInputElement = this.shadowRoot.getElementById("search-input");
      this.filteredItemsElement = this.shadowRoot.getElementById(
        "filtered-items-text"
      );

      this.selectedItemsElement = this.shadowRoot.getElementById(
        "selected-items-text"
      );

      this.selectElement = this.shadowRoot.getElementById("target-select");
      this.selectElement.innerHTML = this.innerHTML;

      // Set our multiple flag
      if (this.hasAttribute("multiple")) {
        this.selectElement.setAttribute("multiple", "true");
      }

    }

    populateFilteredItems = (e) => {
      let filteredOpts = [...this.selectElement.querySelectorAll('option:not(["selected"])')
      .filter(opt => (opt.innerHTML.toLowerCase().search(e.target.value.toLowerCase()) >= 0))]

      const filteredItemDivs = filteredOpts
        .map(opt => {
          let li = document.createElement("div");
          li.innerText = opt.innerHTML;
          li.dataset.value = opt.value;
          li.addEventListener("click", (e) => {
            e.target.setAttribute('selected', '');
          });
        });
      
        this.filteredItemsElement.replaceChildren(...filteredItemDivs);
    };

    populateSelectedItems = (e) => {
      this.selectedOptions = e.target.selectedOptions;

      const selectedItemDivs = [...e.target.selectedOptions].map(opt => {
          let li = document.createElement("div");
          li.innerText = opt.innerHTML;
          li.dataset.value = opt.value;
          li.addEventListener("click", (e) => {
            opt.removeAttribute('selected')
          });
          return li;
        });
      this.selectedItemsElement.replaceChildren(...selectedItemDivs);
        //this.dispatchEvent(new Event('change'));
    }

    connectedCallback() {
      this.searchInputElement.addEventListener("keyup", populateFilteredItems);
      this.searchInputElement.addEventListener("click", populateFilteredItems);
      this.selectElement.addEventListener('change', populateSelectedItems)
    }

    disconnectedCallback() {
      this.searchInputElement.removeEventListener();
      this.selectElement.removeEventListener();
    }
  }
);

document.getElementById("search-select1").addEventListener("change", (e) => {
  console.log("event received", e);
});

document
  .getElementById("search-select1")
  .shadowRoot.getElementById("target-select").selectedOptions;
