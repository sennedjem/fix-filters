UTMarketSearchResultsViewController.prototype._requestItems = function _requestItems(l) {
    this._paginationViewModel.stopAuctionUpdates();
    if(this._searchCriteria._type == "player"){
        var context = this;

        requestItems()
    } else {
        services.Item.searchTransferMarket(this._searchCriteria, l).observe(this, function _onRequestItemsComplete(e, t) {
            if (e.unobserve(this),
            !t.success)
                return NetworkErrorManager.checkCriticalStatus(t.status) ? void NetworkErrorManager.handleStatus(t.status) : (services.Notification.queue([services.Localization.localize("popup.error.searcherror"), enums.UINotificationType.NEGATIVE]),
                void this.getNavigationController().popViewController());
            if (0 < this._searchCriteria.offset && 0 === t.data.items.length)
                this._requestItems(l - 1);
            else {
                var i = this._paginationViewModel.getNumItemsPerPage()
                var o = t.data.items.slice();
                setItems(this,o,i,t.data.items)
            }
            this._paginationViewModel.startAuctionUpdates()
        })
    }

    function update(data,context) {
        UTItemEntityFactory.prototype.auctionFactory = new UTAuctionEntityFactory()
        var i = context._paginationViewModel.getNumItemsPerPage()
        var o = UTItemEntityFactory.prototype.generateItemsFromAuctionData(data.auctionInfo)
        if (0 < context._searchCriteria.offset && 0 === data.auctionInfo.length)
                context._requestItems(l - 1);
        else {
           setItems(context,o,i,data.auctionInfo)
        }
        context._paginationViewModel.startAuctionUpdates()   
    }

    function addFilters(context,url){
        if(context._searchCriteria.rarities.length>0){
            url = url + "&rarityIds="+context._searchCriteria.rarities[0]    
        }
        if(context._searchCriteria.nation!=-1){
            url = url + "&nat="+ context._searchCriteria.nation
        }
        if(context._searchCriteria.level!="any"){
            if(context._searchCriteria.level == "SP"){
                url = url + "&rare="+ context._searchCriteria.level
            } else {
                url = url + "&lev="+ context._searchCriteria.level
            }
        }
        if(context._searchCriteria.club!=-1){
            url = url + "&team="+ context._searchCriteria.club
        }
        if(context._searchCriteria._zone!=-1){
            var zones = {
                "130": "defense",
                "131": "midfield",
                "132": "attacker" 
            }
            url = url + "&zone="+ zones[context._searchCriteria._zone]
        }
        if(context._searchCriteria.position!="any"){
            url = url + "&pos="+ context._searchCriteria.position
        }
        if(context._searchCriteria.maskedDefId){
            url = url + "&maskedDefId="+ context._searchCriteria.maskedDefId
        }    
        if(context._searchCriteria.league!=-1){
            url = url + "&leag="+ context._searchCriteria.league
        }
        if(context._searchCriteria.playStyle!=-1){
            url = url + "&playStyle="+ context._searchCriteria.playStyle
        }
        if(context._searchCriteria.minBuy){
            url = url + "&minb="+ context._searchCriteria.minBuy
        }
        if(context._searchCriteria.maxBuy){
            url = url + "&maxb="+ context._searchCriteria.maxBuy
        }
        if(context._searchCriteria.minBid){
            url = url + "&micr="+ context._searchCriteria.minBid
        }
        if(context._searchCriteria.minBid){
            url = url + "&micr="+ context._searchCriteria.minBid
        }
        if(context._searchCriteria.maxBid){
            url = url + "&macr="+ context._searchCriteria.maxBid
        }
        if(context._searchCriteria.defId.length>0){
            url = url + "&definitionId="+ context._searchCriteria.defId[0]
        }
        return url
    }

    function requestItems(){
        var url = `${services.Authentication.sessionUtas.url}/ut/game/fifa21/transfermarket?num=21&start=${(l-1)*20}&type=player`;
        url = addFilters(context,url)
        fetch(url, {
            headers: {
            "X-UT-SID": services.Authentication.getUtasSession()["id"]
        }}).then(function(response) {
            return response.json();
        }).then(function(data) {
            update(data,context)             
        }).catch(function(error){
            services.Notification.queue([services.Localization.localize("popup.error.searcherror"),enums.UINotificationType.NEGATIVE])
            void context.getNavigationController().popViewController();
        })
    }

    function setItems(context,o,i,responseItems){
        if (context.onDataChange.notify({
            items: o
        }),
        o.length > i && (o = o.slice(0, i)),
        context._paginationViewModel.setPageItems(o),
        context._paginationViewModel.setPageIndex(l),
        context._selectedItem && 0 < o.length) {
            var n = context._paginationViewModel.getIndexByItemId(context._selectedItem.id);
            0 < n && context._paginationViewModel.setIndex(n),
            context._selectedItem = null
        }
        var s = context.getView()
          , r = null;
        if (!context._stadiumViewmodel || context._searchCriteria.type !== SearchType.VANITY && context._searchCriteria.type !== SearchType.CLUB_INFO && context._searchCriteria.type !== SearchType.BALL || (r = context._stadiumViewmodel.getStadiumProgression(context._searchCriteria.subtypes)),
        s.setItems(context._paginationViewModel.getCurrentPageItems(), r),
        s.setPaginationState(1 < l, responseItems.length > i),
        JSUtils.isValid(context._compareItem) && !context._squadContext) {
            var a = JSUtils.find(o, function(e) {
                return e.getAuctionData().tradeId === context._compareItem.getAuctionData().tradeId
            }
            .bind(context));
            JSUtils.isValid(a) ? context._pinnedListItem.setItem(a) : context._paginationViewModel.setPinnedItem(context._compareItem)
        } else
            !isPhone() && 0 < o.length && s.selectListRow(context._paginationViewModel.getCurrentItem().id)
    }
}


accessobjects.Club.getUrlParams = function(searchCriteria) {
    var criteria = {};
    criteria.type = searchCriteria.type === SearchType.ANY ? SearchType.PLAYER : searchCriteria.type,
    criteria.start = searchCriteria.offset,
    criteria.count = searchCriteria.count;
    var formedCriteria = criteria;
    searchCriteria.sortBy === SearchSortType.RECENCY ? formedCriteria.acquiredDate = searchCriteria.sort : (formedCriteria.sort = searchCriteria.sort,
    formedCriteria.sort !== SearchSortOrder.NONE && (formedCriteria.sortBy = searchCriteria.sortBy));
    if (searchCriteria.type === SearchType.VANITY)
        formedCriteria.vanitySubTypeIds = searchCriteria.subtypes;
    else
        searchCriteria.category !== SearchCategory.ANY && (formedCriteria.type = searchCriteria.category.toLowerCase());
    if (searchCriteria.rarities.length > 0)
        formedCriteria.rarityIds = searchCriteria.rarities.join(',');
    if (searchCriteria.level === enums.SearchLevel.SPECIAL)
        formedCriteria.rare = searchCriteria.level;
    else
        searchCriteria.level !== enums.SearchLevel.ANY && (formedCriteria.level = searchCriteria.level);
    searchCriteria.club > 0 && (formedCriteria.team = searchCriteria.club);
    searchCriteria.league > 0 && (formedCriteria.league = searchCriteria.league);
    searchCriteria.nation > 0 && (formedCriteria.nation = searchCriteria.nation);
    searchCriteria.untradeables !== enums.SearchUntradeables.DEFAULT && (formedCriteria.isUntradeable = searchCriteria.untradeables);
    searchCriteria.excludeDefIds.length > 0 && (formedCriteria.excldef = searchCriteria.excludeDefIds.join(','));
    searchCriteria.isExactSearch && (formedCriteria.filter = "exact");
    if (searchCriteria.zone !== -1)
        switch (searchCriteria.zone) {
        case ZONE_DEFENDER_VALUE:
            formedCriteria["type"] = "playerdefender";
            break;
        case ZONE_MIDFIELDER_VALUE:
            formedCriteria["type"] = "playermidfielder";
            break;
        case ZONE_ATTACKER_VALUE:
            formedCriteria["type"] = "playerforward";
            break;
        case ZONE_NO_GK_VALUE:
            formedCriteria["type"] = "playernonGK";
            break;
        default:
            DebugUtils.Assert(![], "Unsupported zone ID in club search.");
            break;
        }
    else
        searchCriteria.position !== SearchType["ANY"] && (formedCriteria.position = searchCriteria.position);
    return searchCriteria.playStyle > 0 && (formedCriteria.playStyle = searchCriteria.playStyle),
    searchCriteria.hasValidDefId() && (formedCriteria.defId = searchCriteria.defId.join(',')),
    formedCriteria;
}
