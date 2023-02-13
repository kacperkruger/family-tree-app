import { nextTick } from "vue";

const scrollToBottom = async (container: Element | undefined) => {
  if (container) {
    await nextTick(() => {
      container.scrollTo({
        top: container.scrollHeight,
        left: 0,
        behavior: "smooth",
      });
    });
  }
};

export default scrollToBottom;
