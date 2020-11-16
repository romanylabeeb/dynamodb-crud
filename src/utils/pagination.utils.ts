
export class PaginationUtils {
    static getPagination(totalResults: any, rpp: any) {
        rpp = rpp ? rpp : 10;
        let pagination: any = {
            totalResults: totalResults,
            rpp: rpp,
            totalPages: Math.ceil(totalResults / rpp)
        };
        return pagination;
    }
}