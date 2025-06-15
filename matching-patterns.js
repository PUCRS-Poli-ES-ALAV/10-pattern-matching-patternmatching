// SISTEMA DE CONTAGEM DE OPERAÇÕES
let operationCounter = 0;

function resetCounter() {
    operationCounter = 0;
}

function count() {
    operationCounter++;
}

// 1. ALGORITMO NAIVE (FORÇA BRUTA)
function naiveSearch(text, pattern) {
    resetCounter();
    const n = text.length;
    const m = pattern.length;
    let iterations = 0;

    for (let i = 0; i <= n - m; i++) {
        count(); // operação de loop externo
        iterations++;
        let j = 0;
        
        while (j < m && text[i + j] === pattern[j]) {
            count(); // operação de comparação
            j++;
        }
        
        if (j === m) {
            return { position: i, iterations, operations: operationCounter };
        }
    }
    
    return { position: -1, iterations, operations: operationCounter };
}

// 2. RABIN-KARP (HASH DE HORNER PADRÃO)
function rabinKarpSearch(text, pattern) {
    resetCounter();
    const R = 256; // tamanho do alfabeto
    const Q = 101; // número primo para módulo
    const n = text.length;
    const m = pattern.length;
    let iterations = 0;

    function hash(s, M) {
        let h = 0;
        for (let j = 0; j < M; j++) {
            count(); // operação de hash
            h = (h * R + s.charCodeAt(j)) % Q;
        }
        return h;
    }

    const patHash = hash(pattern, m);
    
    for (let i = 0; i <= n - m; i++) {
        count(); // operação de loop
        iterations++;
        const txtHash = hash(text.substring(i, i + m), m);
        
        if (patHash === txtHash) {
            count(); // operação de verificação
            // Verificação adicional para evitar falsos positivos
            let match = true;
            for (let j = 0; j < m; j++) {
                count(); // operação de verificação caractere
                if (text[i + j] !== pattern[j]) {
                    match = false;
                    break;
                }
            }
            if (match) {
                return { position: i, iterations, operations: operationCounter };
            }
        }
    }
    
    return { position: -1, iterations, operations: operationCounter };
}

// 3. RABIN-KARP COM ROLLING HASH
function rabinKarpRollingSearch(text, pattern) {
    resetCounter();
    const R = 256;
    const Q = 101;
    const n = text.length;
    const m = pattern.length;
    let iterations = 0;

    if (m > n) return { position: -1, iterations: 0, operations: 0 };

    // Pré-computar R^(m-1) % Q
    let RM = 1;
    for (let i = 1; i <= m - 1; i++) {
        count(); // operação de pré-computação
        RM = (R * RM) % Q;
    }

    // Calcular hash inicial do padrão e da primeira janela do texto
    let patHash = 0;
    let txtHash = 0;
    
    for (let i = 0; i < m; i++) {
        count(); // operação de hash inicial
        patHash = (R * patHash + pattern.charCodeAt(i)) % Q;
        txtHash = (R * txtHash + text.charCodeAt(i)) % Q;
    }

    // Verificar primeira posição
    if (patHash === txtHash) {
        count(); // operação de verificação
        let match = true;
        for (let j = 0; j < m; j++) {
            count(); // operação de verificação caractere
            if (text[j] !== pattern[j]) {
                match = false;
                break;
            }
        }
        if (match) {
            return { position: 0, iterations: 1, operations: operationCounter };
        }
    }

    // Rolling hash para as demais posições
    for (let i = m; i < n; i++) {
        count(); // operação de loop
        iterations++;
        
        // Remover caractere à esquerda e adicionar à direita
        txtHash = (txtHash + Q - RM * text.charCodeAt(i - m) % Q) % Q;
        count(); // operação de rolling hash
        txtHash = (txtHash * R + text.charCodeAt(i)) % Q;
        count(); // operação de rolling hash

        if (patHash === txtHash) {
            count(); // operação de verificação
            let match = true;
            for (let j = 0; j < m; j++) {
                count(); // operação de verificação caractere
                if (text[i - m + 1 + j] !== pattern[j]) {
                    match = false;
                    break;
                }
            }
            if (match) {
                return { position: i - m + 1, iterations, operations: operationCounter };
            }
        }
    }
    
    return { position: -1, iterations, operations: operationCounter };
}

// 4. KNUTH-MORRIS-PRATT (KMP)
function kmpSearch(text, pattern) {
    resetCounter();
    const n = text.length;
    const m = pattern.length;
    let iterations = 0;

    // Construir tabela LPS (Longest Proper Prefix)
    function computeLPS(pat) {
        const lps = new Array(m).fill(0);
        let len = 0;
        let i = 1;

        while (i < m) {
            count(); // operação LPS
            if (pat[i] === pat[len]) {
                len++;
                lps[i] = len;
                i++;
            } else {
                if (len !== 0) {
                    len = lps[len - 1];
                } else {
                    lps[i] = 0;
                    i++;
                }
            }
        }
        return lps;
    }

    const lps = computeLPS(pattern);
    let i = 0; // índice para text
    let j = 0; // índice para pattern

    while (i < n) {
        count(); // operação de loop principal
        iterations++;
        
        if (pattern[j] === text[i]) {
            j++;
            i++;
        }

        if (j === m) {
            return { position: i - j, iterations, operations: operationCounter };
        } else if (i < n && pattern[j] !== text[i]) {
            if (j !== 0) {
                j = lps[j - 1];
            } else {
                i++;
            }
        }
    }

    return { position: -1, iterations, operations: operationCounter };
}

// FUNÇÕES DE TESTE E GERAÇÃO DE DADOS

function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function runSingleTest(algorithm, text, pattern) {
    const start = performance.now();
    const result = algorithm(text, pattern);
    const time = performance.now() - start;
    
    return {
        position: result.position,
        iterations: result.iterations,
        operations: result.operations,
        time: time.toFixed(2)
    };
}

function runComparisonTests() {
    const sizes = [1000, 10000, 50000, 100000, 500000];
    const pattern = "PATTERN";
    const algorithms = {
        naive: naiveSearch,
        rabinKarp: rabinKarpSearch,
        rabinKarpRolling: rabinKarpRollingSearch,
        kmp: kmpSearch
    };
    
    const results = [];

    console.log("Executando testes comparativos...\n");
    console.log("Tamanho\t\tAlgoritmo\t\tIterações\tOperações\tTempo(ms)");
    console.log("-".repeat(70));

    for (const size of sizes) {
        // Gerar texto com padrão em posição específica (~90% do texto)
        const textPart1 = generateRandomString(Math.floor(size * 0.9));
        const textPart2 = generateRandomString(size - textPart1.length - pattern.length);
        const text = textPart1 + pattern + textPart2;
        
        const testResults = {};
        
        for (const [name, algorithm] of Object.entries(algorithms)) {
            const result = runSingleTest(algorithm, text, pattern);
            testResults[name] = result;
            
            console.log(`${size}\t\t${name}\t\t${result.iterations}\t\t${result.operations}\t\t${result.time}`);
        }
        
        results.push({ size, ...testResults });
        console.log("-".repeat(70));
    }
    
    return results;
}

// TESTES ESPECÍFICOS

function testSmallExample() {
    console.log("=== TESTE COM EXEMPLO PEQUENO ===");
    const text = "ABCDCBDCBDACBDABDCBADF";
    const pattern = "ADF";
    
    console.log(`Texto: "${text}"`);
    console.log(`Padrão: "${pattern}"`);
    console.log();
    
    const algorithms = {
        "Naive": naiveSearch,
        "Rabin-Karp": rabinKarpSearch,
        "RK Rolling": rabinKarpRollingSearch,
        "KMP": kmpSearch
    };
    
    for (const [name, algorithm] of Object.entries(algorithms)) {
        const result = runSingleTest(algorithm, text, pattern);
        console.log(`${name}:`);
        console.log(`  Posição: ${result.position}`);
        console.log(`  Iterações: ${result.iterations}`);
        console.log(`  Operações: ${result.operations}`);
        console.log(`  Tempo: ${result.time}ms`);
        console.log();
    }
}

function testLargeStrings() {
    console.log("=== TESTE COM STRINGS GRANDES ===");
    const size = 100000;
    const pattern = "PATTERN";
    const text = generateRandomString(size - pattern.length) + pattern + generateRandomString(100);
    
    console.log(`Tamanho do texto: ${text.length} caracteres`);
    console.log(`Padrão: "${pattern}"`);
    console.log();
    
    const algorithms = {
        "Naive": naiveSearch,
        "Rabin-Karp": rabinKarpSearch,
        "RK Rolling": rabinKarpRollingSearch,
        "KMP": kmpSearch
    };
    
    for (const [name, algorithm] of Object.entries(algorithms)) {
        const result = runSingleTest(algorithm, text, pattern);
        console.log(`${name}:`);
        console.log(`  Posição: ${result.position}`);
        console.log(`  Iterações: ${result.iterations.toLocaleString()}`);
        console.log(`  Operações: ${result.operations.toLocaleString()}`);
        console.log(`  Tempo: ${result.time}ms`);
        console.log();
    }
}

// EXECUTAR TODOS OS TESTES
function executeAllTests() {
    console.log("ANÁLISE DE ALGORITMOS DE PATTERN MATCHING");
    console.log("==========================================\n");
    
    testSmallExample();
    testLargeStrings();
    
    console.log("\n=== TESTE COMPARATIVO COMPLETO ===");
    const results = runComparisonTests();
    
    console.log("\n=== ANÁLISE DE COMPLEXIDADE ===");
    console.log("Naive: O(n×m) - Força bruta");
    console.log("Rabin-Karp: O(n×m) pior caso, O(n+m) médio");
    console.log("RK Rolling: O(n+m) médio - mais eficiente");
    console.log("KMP: O(n+m) sempre - melhor garantia");
    
    return results;
}

// Para executar os testes, chame:
// executeAllTests();
