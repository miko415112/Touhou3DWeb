import styled from 'styled-components';
const RowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  color: White;
  font-weight: bold;
  font-size: 25pt;
  gap: 20px;

  img {
    width: 50px;
    height: 50px;
  }
`;

export const Profile = ({ src, name }) => {
  return (
    <div className='profile'>
      <RowWrapper>
        <img src={src} />
        <div>{name}</div>
      </RowWrapper>
    </div>
  );
};
