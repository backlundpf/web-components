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

      this.searchInputGroupElement =
        this.shadowRoot.getElementById("search-input-group");
      this.searchInputElement = this.shadowRoot.getElementById("search-input");
      this.filteredItemsElement = this.shadowRoot.getElementById(
        "filtered-items-text"
      );

      this.selectedItemsElement = this.shadowRoot.getElementById(
        "selected-items-text"
      );

      this.options = this.querySelectorAll("option");
    }

    populateFilteredItems = (e) => {
      let filteredOpts = [
        ...this.querySelectorAll("option:not([selected])"),
      ].filter(
        (opt) =>
          opt.innerHTML
            .toLowerCase()
            .search(this.searchInputElement.value.toLowerCase()) >= 0
      );

      const filteredItemDivs = filteredOpts.map((opt) => {
        let li = document.createElement("input");
        li.type = "button";
        // li.form = this.searchInputGroupElement;
        li.value = opt.innerHTML;
        li.dataset.value = opt.value;
        li.addEventListener("click", (e) => {
          opt.setAttribute("selected", "true");
          // this.searchInputElement.dispatchEvent(new Event("change"));
          this.populateSelectedItems();
          this.populateFilteredItems();
          this.dispatchEvent(new Event("change"));
        });
        return li;
      });

      this.filteredItemsElement.replaceChildren(...filteredItemDivs);
    };

    populateSelectedItems = (e) => {
      this.selectedOptions = [...this.options].filter((opt) =>
        opt.hasAttribute("selected")
      );

      const selectedItemDivs = this.selectedOptions.map((opt) => {
        let li = document.createElement("div");
        li.innerText = opt.innerHTML;
        li.dataset.value = opt.value;
        li.addEventListener("click", (e) => {
          opt.removeAttribute("selected");

          this.populateSelectedItems();
          this.populateFilteredItems();
          this.dispatchEvent(new Event("change"));
          // this.searchInputElement.dispatchEvent(new Event("change"));
        });
        return li;
      });
      this.selectedItemsElement.replaceChildren(...selectedItemDivs);
      //this.dispatchEvent(new Event('change'));
    };

    connectedCallback() {
      // this.filteredItemsElement.style.display = "none";
      this.populateFilteredItems();
      this.searchInputGroupElement.addEventListener("focusin", (e) => {
        this.filteredItemsElement.style.display = "block";
      });
      this.searchInputGroupElement.addEventListener("focusout", (e) => {
        //this.filteredItemsElement.style.display = "none";
        console.log("focusout");
      });
      this.searchInputElement.addEventListener(
        "keyup",
        this.populateFilteredItems
      );
      this.searchInputElement.addEventListener(
        "click",
        this.populateFilteredItems
      );
      // this.searchInputElement.addEventListener(
      //   "change",
      //   this.populateFilteredItems
      // );
      // this.filteredItemsElement.addEventListener(
      //   "change",
      //   this.populateFilteredItems
      // );
      // this.addEventListener("change", this.populateSelectedItems);
    }

    disconnectedCallback() {
      this.searchInputElement.removeEventListener();
      this.removeEventListener();
    }
  }
);

document.getElementById("search-select1").addEventListener("change", (e) => {
  console.log("event received", e.target.selectedOptions);
});
