// @refresh reload
import { mount, StartClient } from "@solidjs/start/client";
import { upgradeThemedSvgImages } from "@dev-centr/themed-svg/runtime";

mount(() => <StartClient />, document.getElementById("app")!);

const upgrade = () => upgradeThemedSvgImages();
queueMicrotask(upgrade);

new MutationObserver(upgrade).observe(document.body, {
  childList: true,
  subtree: true,
});
