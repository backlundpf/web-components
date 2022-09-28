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

      this.searchInputGroupElement = this.shadowRoot.getElementById(
        "search-input-group"
      );
      this.searchInputElement = this.shadowRoot.getElementById("search-input");
      this.filteredItemsElement = this.shadowRoot.getElementById(
        "filtered-items-text"
      );

      this.selectedItemsElement = this.shadowRoot.getElementById(
        "selected-items-text"
      );

      this.options = this.querySelectorAll("option");
    }

    initializeFilteredItems = () => {
      const filteredItemDivs = [...this.options].map((opt) => {
        let li = document.createElement("div");
        li.type = "";
        // li.form = this.searchInputGroupElement;
        li.innerText = opt.innerHTML;
        li.dataset.value = opt.value;
        return li;
      });

      this.filteredItemsElement.replaceChildren(...filteredItemDivs);
    };

    populateFilteredItems = (e) => {
      let filteredOpts = [
        ...this.filteredItemsElement.querySelectorAll("div")
      ].foreach(
        (opt) =>
          opt.innerHTML
            .toLowerCase()
            .search(this.searchInputElement.value.toLowerCase()) >= 0
      );
    };

    populateSelectedItems = (e) => {
      this.selectedOptions = [...this.options].filter((opt) =>
        opt.hasAttribute("selected")
      );

      const selectedItemDivs = this.selectedOptions.map((opt) => {
        let li = document.createElement("div");
        li.innerText = opt.innerHTML;
        li.dataset.value = opt.value;
        return li;
      });
      this.selectedItemsElement.replaceChildren(...selectedItemDivs);
      //this.dispatchEvent(new Event('change'));
    };

    selectFilteredItem = (item) => {
      //console.log("Select Filtered Item: ", item);
      [...this.options]
        .find((opt) => opt.value === item.dataset.value)
        .setAttribute("selected", "");
      this.populateSelectedItems();
      this.populateFilteredItems();
    };

    removeSelectedItem = (item) => {
      //console.log("Remove Selected Item: ", item);
      [...this.options]
        .find((opt) => opt.value === item.dataset.value)
        .removeAttribute("selected");
      this.populateSelectedItems();
      this.populateFilteredItems();
    };

    bgChange = () => {
      const rndCol = `rgb(${random(255)}, ${random(255)}, ${random(255)})`;
      console.log("Random Color: ", rndCol);
      return rndCol;
    };

    connectedCallback() {
      this.filteredItemsElement.style.display = "none";
      this.initializeFilteredItems();
      this.populateFilteredItems();
      this.searchInputGroupElement.addEventListener("focusin", (e) => {
        this.filteredItemsElement.style.display = "block";
      });
      // this.searchInputGroupElement.addEventListener("focusout", (e) => {
      //   //this.filteredItemsElement.style.display = "none";
      //   console.log("focusout");
      // });
      this.searchInputElement.addEventListener(
        "keyup",
        this.populateFilteredItems
      );
      // this.searchInputElement.addEventListener(
      //   "click",
      //   this.populateFilteredItems
      // );
      this.filteredItemsElement.addEventListener("click", (e) =>
        this.selectFilteredItem(e.target)
      );
      this.selectedItemsElement.addEventListener("click", (e) =>
        this.removeSelectedItem(e.target)
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
      this.searchInputGroupElement.removeEventListener();
      this.filteredItemsElement.removeEventListener();
      this.searchInputElement.removeEventListener();
      this.removeEventListener();
    }
  }
);

// document.getElementById("search-select1").addEventListener("change", (e) => {
//   console.log("event received", e.target.selectedOptions);
// });
function random(number) {
  return Math.floor(Math.random() * number);
}
