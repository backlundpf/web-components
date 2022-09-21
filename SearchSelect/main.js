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

      // Get all options
      this.selectElement.querySelectorAll("option").forEach((opt) => {
        this.selectableItems.push({
          value: opt.value,
          text: opt.innerHTML,
          filtered: false,
          selected: false,
        });
      });
    }

    updateItems = () => {
      console.log("filtering");
      const filteredItemDivs = this.selectableItems
        .filter((item) => item.filtered && !item.selected)
        .map((item) => {
          let li = document.createElement("div");
          li.innerText = item.text;
          li.dataset.value = item.value;
          li.addEventListener("click", (e) => {
            item.selected = true;
            this.updateItems();
          });
          return li;
        });
      this.filteredItemsElement.replaceChildren(...filteredItemDivs);

      const selectedItemVals = [];

      const selectedItemDivs = this.selectableItems
        .filter((item) => item.selected)
        .map((item) => {
          selectedItemVals.push(item.value);
          let li = document.createElement("div");
          li.innerText = item.text;
          li.dataset.value = item.value;
          li.addEventListener("click", (e) => {
            item.selected = false;
            this.updateItems();
          });
          return li;
        });
      this.selectedItemsElement.replaceChildren(...selectedItemDivs);

      this.selectElement.querySelectorAll("option").forEach((opt) => {
        this.setSelected(opt, selectedItemVals.includes(opt.value));
      });

      console.log(this.selectElement.selectedOptions);
    };

    setSelected = (opt, selected) => {
      if (opt.hasAttribute("selected") && !selected) {
        opt.removeAttribute("selected");
      } else if (selected) {
        opt.setAttribute("selected", true);
      }
    };

    selectedOptions = () => this.selectElement.selectedOptions;

    connectedCallback() {
      this.searchInputElement.addEventListener("keyup", (e) => {
        //filter our items based on the input text
        let filteredItems = this.selectableItems.forEach(
          (item) =>
            (item.filtered =
              item.text.toLowerCase().search(e.target.value.toLowerCase()) >= 0)
        );
        this.updateItems();
      });
    }

    disconnectedCallback() {
      this.shadowRoot.getElementById("search-input").removeEventListener();
    }
  }
);

document.getElementById("search-select1").addEventListener("change", (e) => {
  console.log("event received", e);
});

document
  .getElementById("search-select1")
  .shadowRoot.getElementById("target-select").selectedOptions;
