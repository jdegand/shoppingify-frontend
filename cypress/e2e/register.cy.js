Cypress.env();

describe("register journey", () => {
  it("get register page", () => {
    cy.visit("http://localhost:3000/register");
    cy.get("h2").contains("Register");
    cy.get("button").should("be.disabled");
  });

  it("Password Mismatch", () => {
    cy.get("#username").type(Cypress.env("user"));
    cy.get("#password").type(Cypress.env("password"), { log: false });
    cy.get("#confirm_pwd").type(Cypress.env("wrongPwd"), { log: false });
    cy.get(".invalid").should("exist");
  });

  /*
    it('Username taken error', ()=> {
        cy.get('#username').clear()
        cy.get('#password').clear()
        cy.get('#confirm_pwd').clear()
        cy.get('#username').type(Cypress.env('user'))
        cy.get('#password').type(Cypress.env('password'), {log:false})
        cy.get('#confirm_pwd').type(Cypress.env('confirm'), {log: false})
        cy.get('button').should('be.not.disabled')
        cy.get('button').click()
        cy.get('.errmsg').should('exist')
    })
    */

  it("button enabled with all values filled correct", () => {
    cy.get("#username").clear();
    cy.get("#password").clear();
    cy.get("#confirm_pwd").clear();
    cy.get("#username").type(Cypress.env("newUser"));
    cy.get("#password").type(Cypress.env("password"), { log: false });
    cy.get("#confirm_pwd").type(Cypress.env("confirm"), { log: false });
    cy.get("button").should("be.not.disabled").click();
    cy.wait(2000);
    cy.get("h1").contains("Success!");
    cy.get("a").contains("Sign In");
  });
});
