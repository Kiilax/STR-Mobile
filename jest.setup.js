/* global jest */

/*
La plupart des utilitaires de ce package interagissent 
avec des systèmes externes (système de fichiers, réseau, stockage natif, API Google Maps). 
Afin de garantir la rapidité et la fiabilité des tests, 
sans coûts ni effets secondaires, 
nous utiliserons des MOCKS pour ces limites. 
Cela se justifie dans la mesure où nous testons notre logique, 
et non la fiabilité des bibliothèques Google ou Expo.
*/

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock")
)

jest.mock("expo-file-system", () => ({
  File: jest.fn((path, filename) => ({
    uri: filename ? `${path}${filename}` : path,
    write: jest.fn(),
    move: jest.fn(),
    delete: jest.fn(),
    exists: true,
  })),
  Directory: jest.fn((path) => ({
    uri: path,
    create: jest.fn(),
    exists: true,
  })),
  Paths: { document: "document/", cache: "cache/" },
}))

jest.mock("expo/fetch", () => ({
  fetch: jest.fn(),
}))

global.fetch = jest.fn()

jest.mock("react-native-geocoding", () => ({
  __esModule: true,
  default: {
    init: jest.fn(),
    from: jest.fn(() =>
      Promise.resolve({
        results: [
          {
            formatted_address: "Strasbourg, France",
            geometry: {
              location: { lat: 48.5839, lng: 7.7455 },
            },
          },
        ],
      })
    ),
  },
}))

jest.mock("@/utils/imageStorage", () => ({
  ImageStorage: {
    save: jest.fn(),
  },
}))
