import App from "./App.svelte";

export default class RecruitlyCRMChart {
  constructor(data) {
    this.app = new App({
      target: document.getElementById(data.renderTo),
      props: {
        appData: data,
      },
    });
  }
}