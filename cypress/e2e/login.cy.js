import { nanoid } from "nanoid";
Cypress.env();

describe("Login User Journey", () => {
  it("loads successfully", () => {
    cy.visit("http://localhost:3000");
    cy.get("h2").contains("Sign In");
  });

  it("register link exists", () => {
    cy.get("a").should("exist");
  });

  it("login", () => {
    cy.get("#username").type(Cypress.env("user"));
    cy.get("#password").type(Cypress.env("password"), { log: false });
    cy.get("button").click();
    cy.wait(2000);
    cy.getCookie("jwt").should("exist");
  });

  it("items search", () => {
    cy.get("#items__search").should("be.empty");
    cy.get("#items__search").type("z");
    cy.get("h3").contains("Seltzer");
    cy.focused().clear();
  });

  it("item added and deleted in ListPanel", () => {
    cy.viewport(1400, 600);
    cy.get("#items__search").should("be.empty");
    cy.get("#items__search").type("a");
    cy.get("h3").contains("Mango").click();
    cy.get(".flex > button").should("exist").click();
    cy.get("button.shopping__cart__quantity__btn").contains("1 pc").click();
    cy.get(".quantity__panel__trashcan > .shopping__cart__img")
      .should("exist")
      .click();
    cy.get(".list__panel__save__btn").should("be.disabled");
    cy.get(".shopping__list__no__items__heading").contains("No Items");
    cy.get("#items__search").clear();
  });

  it("items added and saved as list named Test List", () => {
    cy.viewport(1400, 600);
    cy.get("#items__search").should("be.empty");
    cy.get("#items__search").type("a");
    cy.get("h3").contains("Mango").click();
    cy.get(".flex > button").should("exist").click();
    cy.get("button.shopping__cart__quantity__btn").contains("1 pc").click();
    cy.get(":nth-child(4) > .shopping__cart__img").click();
    cy.get(".quantity__panel > .pointer").contains("2 pc");
    cy.get('[data-cy="plus-btn-Water"] > span > .item__plus__img').click();
    cy.get("#list__panel__input").type(`Test List ${nanoid()}`);
    cy.get(".list__panel__save__btn").click();
  });

  it("history tab works", () => {
    cy.get(":nth-child(2) > .normal-tab > .navbar_img").click();
    cy.get('[data-cy="history"]').should("exist");
    cy.get(":nth-child(1) > :nth-child(1) > h2").contains("Test List");
  });

  it("stats tab works", () => {
    cy.get(":nth-child(3) > .normal-tab > .navbar_img").click();
    cy.get(":nth-child(1) > h1").contains("Top Items");
    cy.wait(1000);
    cy.get(":nth-child(1) > :nth-child(2) > .flex > h2").contains("Mango");
    cy.get(":nth-child(2) > :nth-child(2) > .flex > h2").contains("Fruits");
  });

  it("logout", () => {
    cy.get(".nav-btn > .navbar_img").click();
    cy.get("h2").contains("Sign In");
  });
});

/*
  it('makes authenticated request', () => {
  // we can make authenticated request ourselves
  // since we know the token
    cy.request({
      url: 'http://localhost:3000',
      auth: {
        bearer: user.token,
      },
    })
    .its('body')
    .should('deep.equal', [
      {
        id: 1,
        username: 'test',
        firstName: 'Test',
        lastName: 'User',
      },
    ])
  })
*/
