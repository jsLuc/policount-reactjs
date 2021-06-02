import TeachableMachine from '@sashido/teachablemachine-node'

const model = new TeachableMachine({
    modelUrl:'https://teachablemachine.withgoogle.com/models/8gwzKdUea/'
})

export default model