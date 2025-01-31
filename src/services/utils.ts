export const throttle = (mainFunction: Function, delay: number) => {
  let timerFlag: NodeJS.Timeout | null = null;

  return (...args: any) => {
    if (timerFlag === null) {
      mainFunction(...args);
      timerFlag = setTimeout(() => {
        timerFlag = null;
      }, delay);
    }
  };
}