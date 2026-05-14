# AFRICA2KBALL — Mapping des assets visuels

> Généré lors de la session d'intégration — Mai 2026

## Structure cible

```
Africa2kball - site/
└── assets/
    └── images/
        ├── logo-africa2kball.png          ← logo principal (déjà présent)
        ├── hero-africa2kball.PNG           ← fond héros global (déjà présent)
        ├── nations/
        │   ├── caraibes/
        │   ├── senegal/
        │   ├── kongo/
        │   ├── cote-ivoire/
        │   ├── cameroun/
        │   ├── mali/
        │   ├── maghreb/
        │   └── diaspora/
        ├── champions/
        │   ├── edition-1-caraibes/
        │   └── edition-2-senegal/
        └── ambiance/
            ├── histoire/
            └── inscriptions/
```

---

## Tableau source → destination

| Source (`Africa2kBall visuels/`) | Destination (`assets/images/`) | Utilisation |
|---|---|---|
| `Caraibes/DSC05105-Enhanced-NR-2.jpg` | `nations/caraibes/caraibes-01.jpg` | Carte nation Caraïbes (photo principale) |
| `Caraibes/DSC05743-Enhanced-NR.jpg` | `nations/caraibes/caraibes-02.jpg` | Carte nation Caraïbes (alternative) |
| `Caraibes/DSC05754-Enhanced-NR.jpg` | `nations/caraibes/caraibes-03.jpg` | Roster Caraïbes (réserve) |
| `Caraibes/DSC05888-Enhanced-NR.jpg` | `champions/edition-1-caraibes/champion-caraibes-01.jpg` | Card Champion Édition 1 (fond) |
| `Caraibes/DSC05924-Enhanced-NR.jpg` | `champions/edition-1-caraibes/champion-caraibes-02.jpg` | Card Champion Édition 1 (alternative) |
| `Kongo/DSC05112-Enhanced-NR.jpg` | `nations/kongo/kongo-01.jpg` | Carte nation Kongo (photo principale) |
| `Kongo/DSC07057-Enhanced-NR.jpg` | `nations/kongo/kongo-02.jpg` | Carte nation Kongo (alternative) |
| `CI/DSC05104-Enhanced-NR-2.jpg` | `nations/cote-ivoire/cote-ivoire-01.jpg` | Carte nation Côte d'Ivoire (photo principale) |
| `CI/DSC05258-Enhanced-NR.jpg` | `nations/cote-ivoire/cote-ivoire-02.jpg` | Carte nation Côte d'Ivoire (alternative) |
| `Cameroun/DSC05267-Enhanced-NR.jpg` | `nations/cameroun/cameroun-01.jpg` | Carte nation Cameroun (photo principale) |
| `Cameroun/DSC05712-Enhanced-NR.jpg` | `nations/cameroun/cameroun-02.jpg` | Carte nation Cameroun (alternative) |
| `Mali/DSC05148-Enhanced-NR.jpg` | `nations/mali/mali-01.jpg` | Carte nation Mali (photo principale) |
| `Mali/DSC06352-Enhanced-NR.jpg` | `nations/mali/mali-02.jpg` | Carte nation Mali (alternative) |
| `Mahgreb/DSC05319-Enhanced-NR.jpg` | `nations/maghreb/maghreb-01.jpg` | Carte nation Maghreb (photo principale) |
| `Mahgreb/DSC05948-Enhanced-NR.jpg` | `nations/maghreb/maghreb-02.jpg` | Carte nation Maghreb (alternative) |
| `Diaspora/DSC05322-Enhanced-NR.jpg` | `nations/diaspora/diaspora-01.jpg` | Carte nation Diaspora (photo principale) |
| `Diaspora/DSC05545-Enhanced-NR.jpg` | `nations/diaspora/diaspora-02.jpg` | Carte nation Diaspora (alternative) |
| `Gens/DSC06184-Enhanced-NR.jpg` | `nations/senegal/senegal-01.jpg` | Carte nation Sénégal — substitut (dossier Sénégal vide) |
| `Gens/DSC07284-Enhanced-NR.jpg` | `nations/senegal/senegal-02.jpg` | Carte nation Sénégal — substitut (alternative) |
| `Gens/DSC07159-Enhanced-NR.jpg` | `champions/edition-2-senegal/champion-senegal-01.jpg` | Card Champion Édition 2 (fond) |
| `Gens/DSC07299-Enhanced-NR.jpg` | `champions/edition-2-senegal/champion-senegal-02.jpg` | Card Champion Édition 2 (alternative) |
| `Gens/DSC06203-Enhanced-NR.jpg` | `ambiance/histoire/ambiance-histoire-01.jpg` | Section éditoriale histoire.html |
| `Gens/DSC06270-Enhanced-NR.jpg` | `ambiance/histoire/ambiance-histoire-02.jpg` | Section éditoriale histoire.html (réserve) |
| `Gens/DSC06298-Enhanced-NR.jpg` | `ambiance/inscriptions/ambiance-inscriptions-01.jpg` | Carte bénévole — inscriptions.html |
| `Gens/DSC07120-Enhanced-NR.jpg` | `ambiance/inscriptions/ambiance-media-01.jpg` | Carte média — inscriptions.html |

---

## Notes

- **Sénégal** : le dossier source `Africa2kBall visuels/Sénégal/` était vide. Les photos utilisées proviennent du dossier `Gens/` (photos de joueurs/participants sans affiliation nation spécifique).
- **Diaspora** : pas de dossier source dédié — les photos proviennent du dossier `Diaspora/` qui contenait des clichés d'ambiance communautaire.
- Tous les noms de fichiers destination sont en **minuscules, sans espaces, sans accents** pour compatibilité maximale (serveurs Linux sensibles à la casse).
- Les images sont utilisées avec `object-fit: cover` + `object-position: top center` pour garantir le cadrage optimal des joueurs.
