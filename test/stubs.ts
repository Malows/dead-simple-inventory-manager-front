/**
 * Rendering stubs for Quasar components.
 * These stubs render their slot content (unlike shallowMount's auto-stubs),
 * ensuring template slot functions are covered by V8 coverage.
 */
const Slot = { template: '<div><slot/></div>' }
const SlotForm = { template: "<form @submit.prevent=\"$emit('submit')\"><slot/></form>" }
const Void = { template: '<div/>' }

export const qStubs: Record<string, object | boolean> = {
  QLayout: Slot,
  QHeader: Slot,
  QToolbar: Slot,
  QToolbarTitle: Slot,
  QBtn: { template: '<button><slot/></button>' },
  QPage: Slot,
  QPageSticky: Slot,
  QPageContainer: Slot,
  QDrawer: Slot,
  QMenu: Slot,
  QList: Slot,
  QItem: Slot,
  QItemSection: Slot,
  QItemLabel: Slot,
  QCard: Slot,
  QCardSection: Slot,
  QCardActions: Slot,
  QSeparator: Void,
  QIcon: Void,
  QInput: { template: '<input/>', props: ['modelValue', 'label', 'rules', 'type', 'lazyRules'] },
  QSelect: Void,
  QToggle: Void,
  QTabs: Slot,
  QTab: Void,
  QTabPanels: Slot,
  QTabPanel: Slot,
  QFab: Slot,
  QImg: Void,
  QFile: Void,
  QForm: SlotForm,
  QDialog: Slot,
  QPagination: Void,
  QCheckbox: Void,
  QSpinner: Void
}
