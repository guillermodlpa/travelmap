/**
 * Provides the possibility to add CSS filter rules using a distortion
 * This one is used for buttons, with the rule `filter: url(#wavy-button)`
 */
export default function ButtonCssFilter() {
  // the svg styles are a workaround bc display none doesn't work in Firefox. https://bugzilla.mozilla.org/show_bug.cgi?id=376027
  return (
    <svg style={{ position: 'absolute', height: '0' }}>
      <filter id="wavy-button">
        <feTurbulence x="0" y="0" baseFrequency="0.03" numOctaves="5" seed="5"></feTurbulence>
        <feDisplacementMap in="SourceGraphic" scale="2" />
      </filter>
    </svg>
  );
}
