import {TemplateDocument} from "../../../schemas/template.schema";
import {HydratedDocument, Model, PaginateModel, PaginateResult, QueryWithHelpers} from "mongoose";

//: QueryWithHelpers<Array<HydratedDocument<TemplateDocument, {}, {}>>, HydratedDocument<TemplateDocument, {}, {}>, {}, TemplateDocument>
export default function getFilteredTemplates(templateModel: PaginateModel<TemplateDocument>, categories:string, tags:string, colors:string, query: string = "", limit: number = 10, offset: number = 0) {

    const categoriesArray = categories ? categories.split(","): []
    const filteredCategories = categoriesArray.map(i => {
        return i.match(/[^"'\s]*/g)[0]
    }).filter(i=> !!i)

    const colorsArray = colors ? colors.split(",") : []
    const filteredColors = colorsArray.map(i => {
        return i.match(/[^"'\s]*/g)[0]
    }).filter(i=> !!i)

    const tagsArray = tags ? tags.split(",") : []
    const filteredTags = tagsArray.map(i => {
        return i.match(/[^"'\s]*/g)[0]
    }).filter(i=> !!i)
    // const templates = templateModel.find()
    //
    // if (categoriesArray) {
    //     templates.where("categories").equals(categoriesArray)
    // }
    //
    // if (tagsArray) {
    //     templates.where("tags").equals(tagsArray)
    // }
    //
    // if (colorsArray) {
    //     templates.where("colors").equals(colorsArray)
    // }

    // return templates
    if (filteredCategories.length > 0 && filteredColors.length > 0 && filteredTags.length > 0) {
        return templateModel.paginate(
            {
                categories: { $in: filteredCategories },
                colors: {$in: filteredColors},
                tags: {$in: filteredTags},
                title: { $regex: query, $options: 'i' }
            },{
                sort: {_id:-1},
                offset: offset,
                limit: limit,
                populate: ["colors","categories","tags"],
            })
    }
        //?category=6230383d1b30dc912e40460c&colors=622c7a8ac00a48074235690f&tags=6230eaee7416ac790f87d8ef
    if (filteredCategories.length > 0 && filteredColors.length > 0 && filteredTags.length === 0) {
        return templateModel.paginate(
            {
                categories: { $in: filteredCategories },
                colors: {$in: filteredColors},
                title: { $regex: query, $options: 'i' }
            },{
                sort: {_id:-1},
                offset: offset,
                limit: limit,
                populate: ["colors","categories","tags"],
            })
    }


    if (filteredCategories.length > 0 && filteredColors.length === 0 && filteredTags.length > 0) {
        return templateModel.paginate(
            {
                categories: { $in: filteredCategories },
                tags: { $in: filteredTags },
                title: { $regex: query, $options: 'i' }
            },{
                sort: {_id:-1},
                offset: offset,
                limit: limit,
                populate: ["colors","categories","tags"],
            })
    }

    if (filteredCategories.length === 0 && filteredColors.length > 0 && filteredTags.length > 0) {
        return templateModel.paginate(
            {
                colors: {$in: filteredColors},
                tags: { $in: filteredTags },
                title: { $regex: query, $options: 'i' }
            },{
                sort: {_id:-1},
                offset: offset,
                limit: limit,
                populate: ["colors","categories","tags"],
            })
    }


    if (filteredCategories.length > 0 && filteredColors.length === 0 && filteredTags.length === 0) {
        return templateModel.paginate(
            {
                    categories: { $in: filteredCategories },
                    title: { $regex: query, $options: 'i' }
                },{
                    sort: {_id:-1},
                    offset: offset,
                    limit: limit,
                    populate: ["colors","categories","tags"],
                })
    }

    if (filteredCategories.length === 0 && filteredColors.length > 0 && filteredTags.length === 0) {
        return templateModel.paginate(
            {
                colors: { $in: filteredColors },
                title: { $regex: query, $options: 'i' }
            },{
                sort: {_id:-1},
                offset: offset,
                limit: limit,
                populate: ["colors","categories","tags"],
            })
    }

    if (filteredCategories.length === 0 && filteredColors.length === 0 && filteredTags.length > 0) {
        return templateModel.paginate(
            {
                tags: { $in: filteredTags },
                title: { $regex: query, $options: 'i' }
            },{
                sort: {_id:-1},
                offset: offset,
                limit: limit,
                populate: ["colors","categories","tags"],
            })
    }

    else {
        return templateModel.paginate({},{
            sort: {_id:-1},
            offset: offset,
            limit: limit,
            populate: ["colors","categories","tags"],
        })
    }
}