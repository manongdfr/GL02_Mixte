describe("Program Syntactic testing of CRUParser", function () {
  beforeAll(function () {
    const CRU = require("../CRU");

    const CRUParser = require("../CRUParser");
    this.analyzer = new CRUParser();
  });

  it("can read a 'ue' from a simulated input", function () {
    let input = ["+", "GL02"];
    expect(this.analyzer.ue(input)).toBe("GL02");
  });

  it("can read a 'place' from a simulated input", function () {
    let input = [",", "P", "20"];
    expect(this.analyzer.place(input)).toBe("20");
  });

  it("can read a 'salle' from a simulated input", function () {
    let input = ["S", "M102"];
    expect(this.analyzer.salle(input)).toBe("M102");
  });

  it("can read a 'statut' from a simulated input", function () {
    let input = ["1"];
    expect(this.analyzer.statut(input)).toBe("1");
  });

  it("can read a 'type' from a simulated input", function () {
    let input = ["D1"];
    expect(this.analyzer.type(input)).toBe("D1");
  });

  it("can read a 'sousgroupe' from a simulated input", function () {
    let input = [",", "F1"];
    expect(this.analyzer.sousgroupe(input)).toBe("F1");
  });
});
