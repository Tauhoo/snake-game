import styled from 'styled-components'
import { State } from '../core/state'
import Button from './Button'

interface ContainerProps {
  enable: boolean
}

const Container = styled.div<ContainerProps>`
  max-width: 100%;
  width: 500px;
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 25px;
  box-sizing: border-box;
  opacity: ${(props: ContainerProps): number => (props.enable ? 1 : 0)};
  transform: translate(-50%, -50%)
    scale(${(props: ContainerProps): number => (props.enable ? 1 : 0)});
  transition: 0.3s;
  pointer-events: ${(props: ContainerProps): string =>
    props.enable ? 'auto' : 'none'};
`

const PanelContainer = styled.div`
  background-color: white;
  border-radius: 15px;
  width: 100%;
  padding: 25px;
`

interface menuProps {
  enable: boolean
  setState: (state: State) => void
}

const menu = (props: menuProps) => {
  return (
    <Container enable={props.enable}>
      <PanelContainer>
        <h1>Snake Game</h1>
        <br />
        <Button onClick={() => props.setState(State.IN_GAME)}>Start</Button>
      </PanelContainer>
    </Container>
  )
}

export default menu
