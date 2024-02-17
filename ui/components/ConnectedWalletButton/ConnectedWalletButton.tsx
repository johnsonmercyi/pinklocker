import styles from './styles.module.css';

const ConnectedWalletButton = ({ 
  address, balance, initials 
}: { 
  address: string | undefined; 
  balance: number | undefined; 
  initials: string | undefined 
}) => {

  return (
    <div className={styles.main}>
      <span className={styles.address}>{
        `${address?.substring(0, 6)}...${address?.substring(address.length-4, address.length)}`
      }</span>
      <span className={styles.balance}>{`${balance} ${initials}`}</span>
    </div>
  );
}

export default ConnectedWalletButton;