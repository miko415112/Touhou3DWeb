import styled from "styled-components";

const OptionBlockWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  [id="0"] {
    position: absolute;
    top: 0%;
    left: 40%;
  }
  [id="1"] {
    position: absolute;
    top: 20%;
    left: 32%;
  }
  [id="2"] {
    position: absolute;
    top: 40%;
    left: 24%;
  }
  [id="3"] {
    position: absolute;
    top: 60%;
    left: 16%;
  }
  [id="4"] {
    position: absolute;
    top: 80%;
    left: 8%;
  }
`;

const TouhouFont = styled.div`
  * {
    font-family: DFPOPコン W12;
    font-size: ${(props) => (props.hilight ? "3.4vw" : "3vw")};
    font-weight: bold;
    -webkit-text-stroke: 1px Black;
    background-image: ${(props) =>
      props.hilight
        ? "linear-gradient(to bottom,white 30% ,red)"
        : "linear-gradient(to bottom,white 30%,white)"};
    color: transparent;
    background-clip: text;
    -webkit-background-clip: text;
    opacity: ${(props) => (props.hilight ? 1 : 0.6)};
  }
`;

export const OptionPanel = ({ options, selection }) => {
  return (
    <OptionBlockWrapper className="optionPanel">
      {options.map((option, idx) => {
        const hilight = selection == idx ? 1 : 0;
        return (
          <TouhouFont key={idx} hilight={hilight} id={idx}>
            <div>{option}</div>
          </TouhouFont>
        );
      })}
    </OptionBlockWrapper>
  );
};
