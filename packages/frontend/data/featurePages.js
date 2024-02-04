module.exports = {
	featurePages: [
		{
			slug: "add-text-to-photo",
			gradient: "linear-gradient(180deg, #F5F0F6 0%, rgba(245, 240, 246, 0.5) 48.96%, rgba(245, 240, 246, 0) 100%)",
			tagLinks: [
				{
					value: "photo-editor",
					href: "photo-editor",
					excludeFromLocales: [" mx, br, uk"]
				},
				{
					value: "add-photo-to-photo",
					href: "add-photo-to-photo",
					excludeFromLocales: ["en, mx, br, uk"]
				},
			],
			images: {
				heroSection: {
					imageWidth: 600,
					imageHeight: 400,
					src: "hero-add-text-to-photo.png"
				},
				textPictureSection: [
					{
						imageWidth: 600,
						imageHeight: 400,
						src: "section-add-text-to-photo-1.png",
					},
					{
						imageWidth: 600,
						imageHeight: 400,
						src: "section-add-text-to-photo-2.png",
					},
					{
						imageWidth: 600,
						imageHeight: 400,
						src: "section-add-text-to-photo-3.png",
					},
				]
			},
		},
		{
			slug: "photo-editor",
			gradient: "linear-gradient(180deg, #F1EFD7 0%, rgba(241, 239, 215, 0.50) 48.96%, rgba(245, 240, 246, 0.00) 100%);",
			tagLinks: [
				{
					value: "add-text-to-photo",
					href: "add-text-to-photo",
					excludeFromLocales: ["mx, br, uk"]
				},
				{
					value: "add-photo-to-photo",
					href: "add-photo-to-photo",
					excludeFromLocales: ["en, mx, br, uk"]
				},
			],
			images: {
				heroSection: {
					imageWidth: 600,
					imageHeight: 400,
					src: "hero-photo-editor.png"
				},
				textPictureSection: [
					{
						imageWidth: 600,
						imageHeight: 400,
						src: "section-photo-editor-1.png",
					},
					{
						imageWidth: 600,
						imageHeight: 400,
						src: "section-photo-editor-2.png",
					},
					{
						imageWidth: 600,
						imageHeight: 400,
						src: "section-photo-editor-3.png",
					},
				]
			},
		},
		{
			slug: "add-photo-to-photo",
			gradient: "linear-gradient(180deg, #FFD6BC 0%, rgba(255, 214, 188, 0.25) 48.96%, rgba(245, 240, 246, 0.00) 100%);",
			tagLinks: [
				{
					value: "add-text-to-photo",
					href: "add-text-to-photo",
					excludeFromLocales: ["mx, br, uk"]
				},
				{
					value: "photo-editor",
					href: "photo-editor",
					excludeFromLocales: [" mx, br, uk"]
				},
			],
			images: {
				heroSection: {
					imageWidth: 600,
					imageHeight: 400,
					src: "hero-add-photo-to-photo.png"
				},
				textPictureSection: [
					{
						imageWidth: 600,
						imageHeight: 400,
						src: "section-add-photo-to-photo-1.png",
					},
					{
						imageWidth: 600,
						imageHeight: 400,
						src: "section-add-photo-to-photo-2.png",
					},
					{
						imageWidth: 600,
						imageHeight: 400,
						src: "section-add-photo-to-photo-3.png",
					},
				]
			},
		},
	]
}