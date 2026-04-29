import {
  montanteJurosCompostos,
  calcularDiferencaJuros,
  calcularValorCorrigido,
} from "../src/lib/calculos";

// ─── montanteJurosCompostos ───────────────────────────────────────────────────

describe("montanteJurosCompostos", () => {
  it("retorna o principal quando taxa é 0", () => {
    expect(montanteJurosCompostos(1000, 0, 12)).toBe(1000);
  });

  it("calcula corretamente para 1 período", () => {
    // 1000 * (1 + 0,05)^1 = 1050
    expect(montanteJurosCompostos(1000, 5, 1)).toBeCloseTo(1050, 2);
  });

  it("calcula corretamente para 12 meses a 5% a.m.", () => {
    // 1000 * (1,05)^12 ≈ 1795,86
    expect(montanteJurosCompostos(1000, 5, 12)).toBeCloseTo(1795.86, 1);
  });

  it("aplica composição correta — não é juros simples", () => {
    const composto = montanteJurosCompostos(1000, 10, 2);
    // composto: 1000 * 1,1^2 = 1210
    // simples seria: 1200
    expect(composto).toBeCloseTo(1210, 2);
    expect(composto).toBeGreaterThan(1200);
  });

  it("lança erro para principal zero", () => {
    expect(() => montanteJurosCompostos(0, 5, 12)).toThrow(RangeError);
  });

  it("lança erro para meses zero", () => {
    expect(() => montanteJurosCompostos(1000, 5, 0)).toThrow(RangeError);
  });

  it("lança erro para taxa negativa", () => {
    expect(() => montanteJurosCompostos(1000, -1, 12)).toThrow(RangeError);
  });
});

// ─── calcularDiferencaJuros ───────────────────────────────────────────────────

describe("calcularDiferencaJuros", () => {
  it("diferença é zero quando taxas são iguais", () => {
    const r = calcularDiferencaJuros(10000, 5, 5, 12);
    expect(r.diferencaAbusiva).toBe(0);
    expect(r.percentualExcesso).toBe(0);
    expect(r.status).toBe("DENTRO_DA_MEDIA");
  });

  it("status DENTRO_DA_MEDIA quando excesso ≤ 10%", () => {
    // taxa cobrada 5,5% vs BCB 5% → excesso 10%
    const r = calcularDiferencaJuros(10000, 5.5, 5, 12);
    expect(r.percentualExcesso).toBeCloseTo(10, 1);
    expect(r.status).toBe("DENTRO_DA_MEDIA");
  });

  it("status ACIMA_DA_MEDIA quando excesso entre 10% e 50%", () => {
    // taxa cobrada 6% vs BCB 5% → excesso 20%
    const r = calcularDiferencaJuros(10000, 6, 5, 12);
    expect(r.percentualExcesso).toBeCloseTo(20, 1);
    expect(r.status).toBe("ACIMA_DA_MEDIA");
  });

  it("status POTENCIALMENTE_ABUSIVO quando excesso > 50%", () => {
    // taxa cobrada 8% vs BCB 5% → excesso 60%
    const r = calcularDiferencaJuros(10000, 8, 5, 12);
    expect(r.percentualExcesso).toBeCloseTo(60, 1);
    expect(r.status).toBe("POTENCIALMENTE_ABUSIVO");
  });

  it("diferença abusiva é positiva quando taxa cobrada > BCB", () => {
    const r = calcularDiferencaJuros(10000, 8, 5, 12);
    expect(r.diferencaAbusiva).toBeGreaterThan(0);
  });

  it("valor corrigido usa taxa BCB, não taxa cobrada", () => {
    const r = calcularDiferencaJuros(10000, 8, 5, 12);
    // valorCorrigido = 10000 * (1,05)^12 ≈ 17958,56
    expect(r.valorCorrigido).toBeCloseTo(17958.56, 0);
  });

  it("diferença abusiva é negativa quando taxa cobrada < BCB (raro, mas possível)", () => {
    const r = calcularDiferencaJuros(10000, 3, 5, 12);
    expect(r.diferencaAbusiva).toBeLessThan(0);
  });
});

// ─── calcularValorCorrigido ───────────────────────────────────────────────────

describe("calcularValorCorrigido", () => {
  it("retorna todos os campos obrigatórios", () => {
    const r = calcularValorCorrigido(5000, 7, 4, 24);
    expect(r).toHaveProperty("valorOriginal");
    expect(r).toHaveProperty("valorCorrigido");
    expect(r).toHaveProperty("diferencaAbusiva");
    expect(r).toHaveProperty("percentualExcesso");
    expect(r).toHaveProperty("taxaCobrada");
    expect(r).toHaveProperty("taxaMediaBCB");
    expect(r).toHaveProperty("periodoMeses");
    expect(r).toHaveProperty("status");
  });

  it("preserva o valorOriginal intacto", () => {
    const r = calcularValorCorrigido(5000, 7, 4, 24);
    expect(r.valorOriginal).toBe(5000);
  });

  it("preserva o periodoMeses intacto", () => {
    const r = calcularValorCorrigido(5000, 7, 4, 24);
    expect(r.periodoMeses).toBe(24);
  });

  it("cálculo end-to-end: R$10.000, taxa 10% a.m. cobrada, BCB 5% a.m., 12 meses", () => {
    const r = calcularValorCorrigido(10000, 10, 5, 12);
    // cobrado:   10000 * 1,10^12 ≈ 31384,28
    // corrigido: 10000 * 1,05^12 ≈ 17958,56
    // diferença: ≈ 13425,72
    // excesso:   (10 - 5) / 5 * 100 = 100%
    expect(r.valorCorrigido).toBeCloseTo(17958.56, 0);
    expect(r.diferencaAbusiva).toBeCloseTo(13425.72, 0);
    expect(r.percentualExcesso).toBeCloseTo(100, 1);
    expect(r.status).toBe("POTENCIALMENTE_ABUSIVO");
  });
});
