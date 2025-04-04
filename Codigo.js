"use client"

import { useState } from "react"
import { StyleSheet, Text, View, TouchableOpacity, Alert, Button } from "react-native"

export default function App() {
  // Estados do jogo
  const [sequencia, setSequencia] = useState([])
  const [sequenciaJogador, setSequenciaJogador] = useState([])
  const [jogando, setJogando] = useState(false)
  const [mostrando, setMostrando] = useState(false)
  const [nivel, setNivel] = useState("facil")
  const [pontuacao, setPontuacao] = useState(0)
  const [quadradoPiscando, setQuadradoPiscando] = useState(null)

  // Configurações de dificuldade
  const configuracoes = {
    facil: { velocidade: 1000, passos: 3 },
    medio: { velocidade: 700, passos: 5 },
    dificil: { velocidade: 400, passos: 7 },
  }

  // Cores dos quadrados
  const cores = ["#FF5252", "#FFEB3B", "#4CAF50", "#2196F3", "#9C27B0", "#FF9800", "#795548", "#607D8B", "#E91E63"]

  // Inicia um novo jogo
  const iniciarJogo = () => {
    setSequencia([])
    setSequenciaJogador([])
    setPontuacao(0)
    setJogando(true)
    gerarNovaSequencia()
  }

  // Gera uma nova sequência baseada no nível
  const gerarNovaSequencia = () => {
    const novaSequencia = []
    const tamanhoSequencia = configuracoes[nivel].passos + pontuacao

    for (let i = 0; i < tamanhoSequencia; i++) {
      novaSequencia.push(Math.floor(Math.random() * 9))
    }

    setSequencia(novaSequencia)
    mostrarSequencia(novaSequencia)
  }

  // Mostra a sequência para o jogador
  const mostrarSequencia = (seq) => {
    setMostrando(true)
    setSequenciaJogador([])

    seq.forEach((numero, index) => {
      setTimeout(
        () => {
          piscarQuadrado(numero)

          // Quando terminar de mostrar a sequência
          if (index === seq.length - 1) {
            setTimeout(() => {
              setMostrando(false)
            }, configuracoes[nivel].velocidade)
          }
        },
        index * configuracoes[nivel].velocidade * 1.5,
      )
    })
  }

  // Faz um quadrado piscar
  const piscarQuadrado = (numero) => {
    // Faz o quadrado piscar mudando seu estado
    setQuadradoPiscando(numero)

    // Volta ao normal após um tempo
    setTimeout(() => {
      setQuadradoPiscando(null)
    }, configuracoes[nivel].velocidade / 2)
  }

  // Quando o jogador clica em um quadrado
  const clicarQuadrado = (numero) => {
    if (mostrando || !jogando) return

    // Faz o quadrado piscar quando clicado
    piscarQuadrado(numero)

    const novaSequenciaJogador = [...sequenciaJogador, numero]
    setSequenciaJogador(novaSequenciaJogador)

    // Verifica se o jogador errou
    if (novaSequenciaJogador[novaSequenciaJogador.length - 1] !== sequencia[novaSequenciaJogador.length - 1]) {
      Alert.alert("Ops!", "Você errou a sequência! Tente novamente.")
      setJogando(false)
      return
    }

    // Verifica se o jogador completou a sequência
    if (novaSequenciaJogador.length === sequencia.length) {
      setPontuacao(pontuacao + 1)
      Alert.alert("Parabéns!", "Você acertou a sequência!")
      setTimeout(() => {
        gerarNovaSequencia()
      }, 1000)
    }
  }

  // Renderiza os quadrados do jogo
  const renderizarQuadrados = () => {
    const quadrados = []

    for (let i = 0; i < 9; i++) {
      quadrados.push(
        <TouchableOpacity
          key={i}
          style={[
            styles.quadrado,
            { backgroundColor: cores[i] },
            // Aumenta o brilho quando o quadrado está piscando
            quadradoPiscando === i && styles.quadradoPiscando,
          ]}
          onPress={() => clicarQuadrado(i)}
          disabled={mostrando}
        />,
      )
    }

    return quadrados
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Jogo Genius</Text>

      <View style={styles.niveis}>
        <Button title="Fácil" onPress={() => setNivel("facil")} color={nivel === "facil" ? "#4CAF50" : "#ccc"} />
        <Button title="Médio" onPress={() => setNivel("medio")} color={nivel === "medio" ? "#FF9800" : "#ccc"} />
        <Button title="Difícil" onPress={() => setNivel("dificil")} color={nivel === "dificil" ? "#F44336" : "#ccc"} />
      </View>

      <Text style={styles.pontuacao}>Pontuação: {pontuacao}</Text>

      <View style={styles.grade}>{renderizarQuadrados()}</View>

      <Button title={jogando ? "Reiniciar" : "Iniciar Jogo"} onPress={iniciarJogo} color="#2196F3" />

      {mostrando && <Text style={styles.instrucao}>Observe a sequência...</Text>}
      {!mostrando && jogando && <Text style={styles.instrucao}>Sua vez! Repita a sequência.</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  niveis: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 20,
  },
  pontuacao: {
    fontSize: 18,
    marginBottom: 20,
  },
  grade: {
    width: 300,
    height: 300,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  quadrado: {
    width: 90,
    height: 90,
    margin: 5,
    borderRadius: 5,
  },
  quadradoPiscando: {
    opacity: 0.3,
    borderWidth: 3,
    borderColor: "white",
  },
  instrucao: {
    fontSize: 16,
    marginTop: 10,
    fontStyle: "italic",
  },
})

