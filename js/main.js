import { initDom } from './dom_handler.js';
import { initHandTracking } from './hand_tracker.js';

document.addEventListener('DOMContentLoaded', function() {
  initDom();
  initHandTracking();
});
